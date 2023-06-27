import { db } from 'api/src/lib/db'
import { logger } from 'api/src/lib/logger'
import pdf from 'pdf-parse'
import playwright from 'playwright'
import { YoutubeTranscript } from 'youtube-transcript'

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
      logger.info('⏳ Downloading Youtube Transcript for', url)
      const videoId =
        url.split('v=')[1].split('&')[0] ??
        url.split('youtu.be/')[1].split('&')[0] ??
        url.split('youtube.com/embed/')[1].split('&')[0] ??
        url.split('youtube.com/watch?v=')[1].split('&')[0]
      body = (await YoutubeTranscript.fetchTranscript(videoId))?.toString()
      if (body?.toString().trim() === '') {
        throw new Error('😵 Youtube Transcript is empty')
      }
      logger.info(
        `✅ Downloaded Youtube Transcript for ${url}, ${body
          ?.toString()
          .substring(0, 100)}`
      )
    } catch (e) {
      logger.error(`❌ Cannot Download Youtube Transcript for ${url}, ${e}`)
    }
  }

  // pdf
  else if (
    url.includes('.pdf') ||
    url.includes('.PDF') ||
    (await timedFetch(url).then((res) => res.headers.get('content-type'))) ===
      'application/pdf'
  ) {
    try {
      logger.info('⏳ Downloading PDF for', url)
      const res = await timedFetch(url)
      const arrayBuffer = await res.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const data = await pdf(buffer)
      body = data.text
      if (body?.toString().trim() === '') {
        throw new Error('😵 PDF is empty')
      }
      logger.info(
        `✅ Downloaded PDF for ${url}, ${body?.toString().substring(0, 100)}`
      )
    } catch (e) {
      logger.error(`❌ Cannot Download PDF for ${url}, ${e}`)
    }
  }

  // article, default
  else {
    try {
      logger.info(`⏳ Downloading Article for ${url}`)
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
      logger.info(
        `✅ Downloaded Article for ${url}, ${body
          ?.toString()
          .substring(0, 100)}`
      )
    } catch (e) {
      logger.error(`❌ Cannot Download Article for ${url}, ${e}`)
    }
  }

  // final fallback, use playwright (very slow)
  if (body === '' || String(body).toLowerCase().includes('enable javascript')) {
    try {
      logger.info('⏳ Downloading Default for', url)
      const browser = await playwright.chromium.launch()
      const context = await browser.newContext()
      const page = await context.newPage()
      await page.goto(url)
      body = await page.innerText('body')
      await browser.close()
      if (body?.toString().trim() === '') {
        throw new Error('😵 Default Download is empty')
      }
      logger.info(
        `✅ Downloaded Default for ${url}, ${body
          ?.toString()
          .substring(0, 100)}`
      )
    } catch (e) {
      logger.error(`❌ Cannot Download Default for ${url}, ${e}`)
    }
  }
  return body
}

export default async () => {
  const linkSummaries = await db.linkSummary.findMany({
    where: { body: '' },
    take: 20,
  })
  await Promise.all(
    linkSummaries.map(async ({ id, linkUrl }) => {
      const body = await fetchContent(linkUrl)
      await db.linkSummary.update({
        where: { id },
        data: { body: body?.toString().replace(/\n/g, ' ') },
      })
      logger.info(
        `💾 Updated LinkSummary ${id} with body ${body
          ?.toString()
          .substring(0, 100)}`
      )
    })
  )
}
