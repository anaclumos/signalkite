import { db } from 'api/src/lib/db'
import { JSDOM } from 'jsdom'
import pdf from 'pdf-parse'
import playwright from 'playwright'
import { YoutubeTranscript } from 'youtube-transcript'

import { log, sanitize } from './util'

const timedFetch = async (url: string, timeout = 60000) => {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)
  const response = await fetch(url, {
    signal: controller.signal,
  })
  clearTimeout(id)
  return response
}

export const fetchContent = async (url: string) => {
  if (url === '') {
    return ''
  }

  let body = ''

  // youtube
  if (url?.includes('youtu')) {
    try {
      log(`⏳ Downloading Youtube Transcript for ${url}`, 'info')
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
      log(`✅ Downloaded Youtube Transcript for ${url}`, 'info')
    } catch (e) {
      log(`❌ Cannot Download Youtube Transcript for ${url}, ${e}`, 'error')
      return '' // OpenAI Whisper
    }
  }

  if (
    body === '' &&
    (url?.toLowerCase()?.includes('.pdf') ||
      (await timedFetch(url).then((res) => res.headers.get('content-type'))) ===
        'application/pdf')
  ) {
    try {
      log(`⏳ Downloading PDF for ${url}`, 'info')
      const res = await timedFetch(url)
      const arrayBuffer = await res.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const data = await pdf(buffer)
      body = data.text
      if (body?.toString().trim() === '') {
        throw new Error('PDF is empty')
      }
      log(`✅ Downloaded PDF for ${url}`, 'info')
    } catch (e) {
      log(`❌ Cannot Download PDF for ${url}, ${e}`, 'info')
    }
  }

  // article, default
  if (body === '') {
    try {
      log(`⏳ Downloading Article for ${url}`, 'info')

      const res = await require('request-promise')({
        url: url,
        proxy: process.env.PROXY,
        rejectUnauthorized: false,
      })

      const dom = new JSDOM(res)
      // Remove all script and noscript tags
      dom.window.document.querySelectorAll('script').forEach((item) => {
        item.remove()
      })

      // Remove all style tags
      dom.window.document.querySelectorAll('style').forEach((item) => {
        item.remove()
      })

      // check if article exists. stringify that if it does
      const article = dom.window.document.querySelector('article')
      if (article) {
        body = article.textContent
      } else {
        body = dom.window.document.body.textContent
      }

      log(`✅ Downloaded Article for ${url}`, 'info')
    } catch (e) {
      log(`❌ Cannot Download Article for ${url}, ${e}`, 'info')
    }
  }

  // try naive fetch as Googlebot
  if (body === '') {
    try {
      log(`⏳ Downloading Naive for ${url}`, 'info')
      const res = await timedFetch(url, 30000)
      body = await res.text()
      if (body?.toString().trim() === '') {
        throw new Error('😵 Naive Download is empty')
      }
      log(`✅ Downloaded Naive for ${url}`, 'info')
    } catch (e) {
      log(`❌ Cannot Download Naive for ${url}, ${e}`, 'info')
    }
  }

  // final fallback, use playwright (very slow)
  if (
    body === '' ||
    String(body)?.toLowerCase()?.includes('enable javascript')
  ) {
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
      log(`✅ Downloaded Default for ${url}`, 'info')
    } catch (e) {
      log(`❌ Cannot Download Default for ${url}, ${e}`, 'info')
      body = 'error'
    }
  }
  return sanitize(body)
}

const main = async () => {
  // main business logic goes here
}

export default async () => {
  main()
    .then(async () => {
      await db.$disconnect()
      process.exit(0)
    })
    .catch(async (e) => {
      console.error(e)
      await db.$disconnect()
      process.exit(1)
    })
}
