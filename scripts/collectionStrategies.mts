import { YoutubeTranscript } from 'youtube-transcript'
import Puppeteer, { Browser as PuppeteerBrowser, Page as PuppeteerPage } from 'puppeteer'
import pdf from 'pdf-parse'
import playwright from 'playwright'

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

export const tryDownloadingWithPuppeteer = async (url: string, body: string, retry = 0): Promise<string> => {
  log(`⏳ Downloading\tPuppeteer for ${url}`, 'info')
  if (retry > 5) {
    log(`❌ Error\tCannot Download with Puppeteer for ${url}`, 'error')
    return ''
  }

  if (body.length > 0) {
    log(`💘 Body Exists\ttryDownloadingWithPuppeteer, ${url}`, 'info')
    return sanitize(body)
  }
  let browser: PuppeteerBrowser
  try {
    try {
      log(`⏳ Trying\tBrightData Proxy for ${url}`, 'info')
      browser = await Puppeteer.connect({
        browserWSEndpoint: `wss://${process.env.BRIGHTDATA_USERNAME}:${process.env.BRIGHTDATA_PASSWORD}@${process.env.BRIGHTDATA_PROXY}`,
      })
      browser.createIncognitoBrowserContext()
    } catch (e) {
      log(`🚨\tBrightData Proxy is not available, attempting local, ${e.message}`, 'error')
      browser = await Puppeteer.launch({ headless: 'new' })
      browser.createIncognitoBrowserContext()
    }
    try {
      body = await extract(url, browser)
      await browser.close()
    } catch (e) {
      log(`❌ Error\tCannot Download with Puppeteer for ${url}, ${e}`, 'error')
      await browser.close()
    }
  } catch (e) {
    await new Promise((r) => setTimeout(r, 1000))
    body = await tryDownloadingWithPuppeteer(url, body, retry + 1)
  }
  log(`✅ Success\tDownloaded with Puppeteer for ${url}`)
  return sanitize(body)
}

export const extract = async (url: string, browser: PuppeteerBrowser): Promise<string> => {
  let body = ''
  const page: PuppeteerPage = await browser.newPage()
  page.setDefaultNavigationTimeout(10 * 60 * 1000)
  await page.goto(url)
  try {
    await page.waitForSelector('article', { timeout: 10000 })
  } catch (e) {
    // do nothing
  }
  await page.waitForSelector('body')
  if (await page.$('article')) {
    body = await page.$eval('article', (el) => el.innerText)
  }
  if (await page.$('main')) {
    body = await page.$eval('main', (el) => el.innerText)
  }

  if (await page.$('body')) {
    body = await page.$eval('body', (el) => el.innerText)
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

export const tryDownloadingWithPlaywright = async (url: string, body: string): Promise<string> => {
  if (body.length > 0) {
    log(`💘 Body Exists\ttryDownloadingWithPlaywright, ${url}`, 'info')
    return sanitize(body)
  }
  try {
    log(`⏳ Downloading\tPlaywright for ${url}`, 'info')
    const browser = await playwright.chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(url)
    try {
      body = await page.innerText('.columns-area')
    } catch (e) {
      body = await page.innerText('body')
    }
    log(`✅ Downloaded\tDefault for ${url}`, 'info')
    await browser.close()
  } catch (e) {
    log(`❌ Error\tCannot Download Default for ${url}, ${e}`, 'info')
    body = 'error'
  }

  return sanitize(body)
}
