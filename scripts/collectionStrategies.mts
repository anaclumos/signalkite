import { YoutubeTranscript } from 'youtube-transcript'
import pdf from 'pdf-parse'
import { chromium, Browser, BrowserContext } from 'playwright'

import { log, sanitize } from './util.mjs'

export const tryDownloadingYoutube = async (url: string, body: string): Promise<string> => {
  if (body.length > 0) {
    log(`💘 Body Exists\ttryDownloadingYoutube, ${url}`, 'info')
    return sanitize(body)
  }
  if (!url?.startsWith('https://youtu.be') && !url?.startsWith('https://www.youtube.com')) return ''

  try {
    const videoId =
      url.split('v=')[1].split('&')[0] ??
      url.split('youtu.be/')[1].split('&')[0] ??
      url.split('youtube.com/embed/')[1].split('&')[0] ??
      url.split('youtube.com/watch?v=')[1].split('&')[0]
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)
    body = transcript.map((t) => t.text).join(' ')
    log(`✅ Success\tDownloaded Youtube Transcript for ${url}`)
  } catch (e) {
    log(`❌ Error\tCannot Download Youtube Transcript for ${url}, ${e}`, 'error')
  }
  return sanitize(body)
}

export const tryDownloadingTwitter = async (url: string, body: string): Promise<string> => {
  if (body.length > 0) {
    log(`💘 Body Exists\ttryDownloadingTwitter, ${url}`, 'info')
    return sanitize(body)
  }
  if (
    !url?.startsWith('https://twitter.com') &&
    !url?.startsWith('https://mobile.twitter.com') &&
    !url?.startsWith('https://x.com')
  )
    return ''
  try {
    url = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`
    body = await fetch(url)
      .then((r) => r.json())
      .then((r) => r.html)
  } catch (e) {
    log(`❌ Error\tCannot Download Twitter Transcript for ${url}, ${e}`, 'error')
  }
  return sanitize(body)
}

export const tryDownloadingPdf = async (url: string, body: string): Promise<string> => {
  if (body.length > 0) {
    log(`💘 Body Exists\ttryDownloadingPdf, ${url}`, 'info')
    return sanitize(body)
  }
  if (
    !url?.toLowerCase()?.includes('.pdf') &&
    (await fetch(url).then((res) => res.headers.get('content-type'))) !== 'application/pdf'
  )
    return ''

  try {
    log(`⏳ Downloading\tPDF for ${url}`, 'info')
    const res = await fetch(url)
    const data = await pdf(await res.arrayBuffer())
    body = data.text()
    log(`✅ Downloaded\tPDF for ${url}`, 'info')
  } catch (e) {
    log(`❌ Error\tCannot Download PDF for ${url}`, 'info')
  }
  return sanitize(body)
}

export const tryDownloadingAsGooglebot = async (url: string, body: string): Promise<string> => {
  if (body.length > 0) {
    log(`💘 Body Exists\ttryDownloadingAsGooglebot, ${url}`, 'info')
    return sanitize(body)
  }
  try {
    log(`⏳ Downloading\tNaive for ${url}`, 'info')
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
      signal: AbortSignal.timeout(5000),
    })
    body = await res.text()
    log(`✅ Downloaded\tNaive for ${url}`, 'info')
  } catch (e) {
    log(`❌ Error\tCannot Download Naive for ${url}`, 'info')
  }
  return sanitize(body)
}

export const tryDownloadingWithPlaywright = async (url: string, body: string, retry = 0): Promise<string> => {
  if (body.length > 0) {
    log(`💘 Body Exists\ttryDownloadingWithPlaywright, ${url}`, 'info')
    return sanitize(body)
  }

  log(`⏳ Downloading\tPlaywright for ${url}`)

  if (retry > 5) {
    log(`Cannot download with Playwright after ${retry} retries for ${url}`, 'error')
    return ''
  }

  let browser: Browser | null = null
  let context: BrowserContext | null = null

  try {
    const proxyAuth = process.env.BRIGHTDATA_USERNAME + ':' + process.env.BRIGHTDATA_PASSWORD
    browser = await chromium.connect(`wss://${proxyAuth}@${process.env.BRIGHTDATA_PROXY}`, {
      timeout: 30000, // 30 seconds
    })
  } catch (error) {
    log(`Remote connection failed, launching local Playwright instance: ${error}`, 'error')
    browser = await chromium.launch({
      timeout: 30000, // 30 seconds
    })
  }

  try {
    context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(url, { waitUntil: 'domcontentloaded' })

    let content = await page.evaluate(() => {
      const article = document.querySelector('article')
      if (article) {
        return article.innerText
      }
      const main = document.querySelector('main')
      if (main) {
        return main.innerText
      }
      const body = document.querySelector('body')
      if (body) {
        return body.innerText
      }
    })

    log(`✅ Success\tDownloaded content with Playwright for ${url}`)
    return content
  } catch (error) {
    log(`Error during download with Playwright for ${url}: ${error}`, 'error')
    return await tryDownloadingWithPlaywright(url, body, retry + 1)
  } finally {
    if (context) {
      await context.close()
    }
    if (browser) {
      await browser.close()
    }
  }
}
