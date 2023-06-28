import { db } from 'api/src/lib/db'
import { logger } from 'api/src/lib/logger'
import pdf from 'pdf-parse'
import playwright from 'playwright'
import { YoutubeTranscript } from 'youtube-transcript'

const log = (message: string, level: 'info' | 'error' = 'info') => {
  if (level === 'info') {
    logger.info(message)
  } else {
    logger.error(message)
  }
  console.log(message)
}

const timedFetch = async (url: string, timeout = 10000) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  const response = await fetch(url, {
    signal: controller.signal,
  })
  clearTimeout(id)
  return response
}

const fetchContent = async (url: string) => {
  let body = ''

  // youtube
  if (url.includes('youtu')) {
    try {
      log(`⏳ Downloading Youtube Transcript for ${url}`, 'info')
      const videoId =
        url.split('v=')[1].split('&')[0] ??
        url.split('youtu.be/')[1].split('&')[0] ??
        url.split('youtube.com/embed/')[1].split('&')[0] ??
        url.split('youtube.com/watch?v=')[1].split('&')[0]
      body = (await YoutubeTranscript.fetchTranscript(videoId))?.toString()
      if (body?.toString().trim() === '') {
        throw new Error('😵 Youtube Transcript is empty')
      }
      log(
        `✅ Downloaded Youtube Transcript for ${url}, ${body
          ?.toString()
          .substring(0, 100)}`,
        'info'
      )
    } catch (e) {
      log(`❌ Cannot Download Youtube Transcript for ${url}, ${e}`, 'error')
    }
  }

  if (
    (body === '' && url.toLowerCase().includes('.pdf')) ||
    (await timedFetch(url).then((res) => res.headers.get('content-type'))) ===
      'application/pdf'
  ) {
    try {
      log(`⏳ Downloading PDF for ${url}`, 'info')
      const res = await timedFetch(url)
      const arrayBuffer = await res.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const data = await pdf(buffer)
      body = data.text
      if (body?.toString().trim() === '') {
        throw new Error('😵 PDF is empty')
      }
      log(
        `✅ Downloaded PDF for ${url}, ${body?.toString().substring(0, 100)}`,
        'info'
      )
    } catch (e) {
      log(`❌ Cannot Download PDF for ${url}, ${e}`, 'info')
    }
  }

  // article, default
  if (body === '') {
    try {
      log(`⏳ Downloading Article for ${url}`, 'info')
      const res = await timedFetch(
        `https://web.scraper.workers.dev/?selector=article,+main,+body,+noscript&scrape=text&url=${url}`
      )
      const json = await res.json()
      body =
        json?.result?.article?.toString() ||
        json?.result?.main?.toString() ||
        json?.result?.body?.toString()
      if (body?.toString().trim() === '') {
        throw new Error('😵 Article is empty')
      }
      log(
        `✅ Downloaded Article for ${url}, ${body
          ?.toString()
          .substring(0, 100)}`,
        'info'
      )
    } catch (e) {
      log(`❌ Cannot Download Article for ${url}, ${e}`, 'info')
    }
  }

  // final fallback, use playwright (very slow)
  if (body === '' || String(body).toLowerCase().includes('enable javascript')) {
    try {
      log(`⏳ Downloading Default for ${url}`, 'info')
      const browser = await playwright.chromium.launch()
      const context = await browser.newContext()
      const page = await context.newPage()
      await page.goto(url)
      body = await page.innerText('body')
      await browser.close()
      if (body?.toString().trim() === '') {
        throw new Error('😵 Default Download is empty')
      }
      log(
        `✅ Downloaded Default for ${url}, ${body
          ?.toString()
          .substring(0, 100)}`,
        'info'
      )
    } catch (e) {
      log(`❌ Cannot Download Default for ${url}, ${e}`, 'info')
      body = 'error'
    }
  }
  return body
}

export default async () => {
  const linkSummaries = await db.linkSummary.findMany({
    where: { body: '' },
    take: 20,
  })

  for (const linkSummary of linkSummaries) {
    const { id, linkUrl } = linkSummary
    log(`⏳ Trying LinkSummary ${id} with body ${linkUrl}`, 'info')

    if (linkUrl.includes('twitter.com')) {
      log(`❌ Ignoring Twitter LinkSummary ${id} with body ${linkUrl}`, 'info')
      continue
    }

    const body = await fetchContent(linkUrl)
    await db.linkSummary.update({
      where: { id },
      data: { body: body?.toString().replace(/\n/g, ' ') },
    })

    log(
      `💾 Updated LinkSummary ${id} with body ${body
        ?.toString()
        .substring(0, 100)}`,
      'info'
    )
  }

  log(`🏁 Finished`, 'info')
}
