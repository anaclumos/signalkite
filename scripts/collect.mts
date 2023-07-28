import { log, sanitize } from './util.mjs'
import { YoutubeTranscript } from 'youtube-transcript'
import puppeteer, { Browser } from 'puppeteer-core'

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
    // handle twitter and mastodon
    body = 'N/A'
  }

  if (body === '') {
    try {
      log(`⏳ Downloading\t${url}`, 'info')
      let browser: Browser = null
      try {
        const browser = await puppeteer.connect({
          browserWSEndpoint: `wss://${process.env.BRIGHTDATA_USERNAME}:${process.env.BRIGHTDATA_PASSWORD}@${process.env.BRIGHTDATA_PROXY}`,
        })
        const page = await browser.newPage()
        page.setDefaultNavigationTimeout(2 * 60 * 1000)
        await page.goto(url)
        await page.waitForSelector('body')
        const article = await page.$('article')
        if (article) {
          body = await page.$eval('article', (el) => el.innerText)
        }
        const main = await page.$('main')
        if (main) {
          body = await page.$eval('main', (el) => el.innerText)
        }

        const bodyEl = await page.$('body')
        if (bodyEl) {
          body = await page.$eval('body', (el) => el.innerText)
        }
      } catch (e) {
        console.error('run failed', e)
      } finally {
        await browser?.close()
      }
      log(`✅ Downloaded\tBrightData for ${url}`, 'info')
    } catch (e) {
      log(`❌ Error\tCannot Download BrightData for ${url}\n${e}`, 'info')
    }
  }
  return sanitize(body)
}
