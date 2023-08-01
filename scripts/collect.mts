import { log, sanitize } from './util.mjs'
import { YoutubeTranscript } from 'youtube-transcript'
import Puppeteer, { Browser as PuppeteerBrowser, Page as PuppeteerPage } from 'puppeteer'

export const collect = async (url: string): Promise<string> => {
  if (url === '') return ''

  let body = ''

  // 1. Youtube
  if (url?.includes('youtu')) {
    try {
      const videoId =
        url.split('v=')[1].split('&')[0] ??
        url.split('youtu.be/')[1].split('&')[0] ??
        url.split('youtube.com/embed/')[1].split('&')[0] ??
        url.split('youtube.com/watch?v=')[1].split('&')[0]
      const transcript = await YoutubeTranscript.fetchTranscript(videoId)
      body = transcript.map((t) => t.text).join(' ')
      if (body?.toString().trim() === '') {
        throw new Error('😵 Youtube Transcript is empty')
      }
    } catch (e) {
      log(`❌ Error\tCannot Download Youtube Transcript for ${url}`, 'error')
    }
  }

  if (url?.includes('twitter')) {
    url = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`
    body = await fetch(url)
      .then((r) => r.json())
      .then((r) => r.html)
  }

  if (body === '') {
    let browser: PuppeteerBrowser
    try {
      browser = await Puppeteer.connect({
        browserWSEndpoint: `wss://${process.env.BRIGHTDATA_USERNAME}:${process.env.BRIGHTDATA_PASSWORD}@${process.env.BRIGHTDATA_PROXY}`,
      })
    } catch (e) {
      log(`🚨\t BrightData Proxy is not available, attempting local, ${e.message}`, 'error')
      browser = await Puppeteer.launch({ headless: 'new' })
    }
    body = await extract(url, browser)
    log(`✅ Downloaded\t BrightData for ${url}`, 'info')
  }

  if (body === '') {
    log(`❌ Error\tCannot Download for ${url}`, 'error')
  }

  return sanitize(body)
}

const extract = async (url: string, browser: PuppeteerBrowser): Promise<string> => {
  let body = ''
  try {
    const page: PuppeteerPage = await browser.newPage()
    page.setDefaultNavigationTimeout(2 * 60 * 1000)
    await page.goto(url)
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
  } catch (e) {
    console.error('run failed', e)
  } finally {
    await browser?.close()
  }
  return sanitize(body)
}
