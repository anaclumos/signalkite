import { db } from 'api/src/lib/db'
import { JSDOM, VirtualConsole } from 'jsdom'
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

/**
 * Fetches the content of the url and returns the body of the content.
 * Not Functional: This function has side effects of updating the database.
 *
 * @param url
 * @param commentUrl
 * @returns body of the content
 */
export const fetchContent = async (url: string, commentUrl?: string) => {
  if (url === '') {
    throw new Error('😵 URL is empty')
  }

  // check db, if content exists, return
  const existingContent = await db.summary.findFirst({
    where: { originLink: url, commentLink: commentUrl },
  })

  let body = existingContent?.originBody ?? ''
  let commentBody = existingContent?.commentBody ?? ''
  let locale = 'en'
  let commentLocale = 'en'
  let downloadMethod = 'unknown'

  const originBodyAlreadyExists = body?.trim() !== ''
  const commentBodyAlreadyExists = commentBody?.trim() !== ''

  if (originBodyAlreadyExists && commentBodyAlreadyExists) {
    log(`✅ Exists\t${url}`, 'info')
    return existingContent
  }

  if (!originBodyAlreadyExists) {
    // 1. youtube or twitter
    if (url?.includes('youtu')) {
      try {
        log(`⏳ Downloading\tYoutube Transcript for ${url}`, 'info')
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
        log(`✅ Downloaded\tYoutube Transcript for ${url}`, 'info')
        downloadMethod = 'youtube'
      } catch (e) {
        log(`❌ Error\tCannot Download Youtube Transcript for ${url}`, 'error')
        return existingContent
      }
    }

    if (url?.includes('twitter')) {
      // ignore
      body = 'N/A'
    }

    // 2. pdf

    if (
      body === '' &&
      (url?.toLowerCase()?.includes('.pdf') ||
        (await timedFetch(url).then((res) =>
          res.headers.get('content-type')
        )) === 'application/pdf')
    ) {
      try {
        log(`⏳ Downloading\tPDF for ${url}`, 'info')
        const res = await timedFetch(url)
        const arrayBuffer = await res.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const data = await pdf(buffer)
        body = data.text
        if (body?.toString().trim() === '') {
          throw new Error('PDF is empty')
        }
        log(`✅ Downloaded\tPDF for ${url}`, 'info')
        downloadMethod = 'pdf'
      } catch (e) {
        log(`❌ Error\tCannot Download PDF for ${url}`, 'info')
      }
    }

    // 2. BrightData, default
    if (body === '') {
      try {
        log(`⏳ Downloading\tBrightData for ${url}`, 'info')
        const res = await require('request-promise')({
          url: url,
          proxy: process.env.PROXY,
          rejectUnauthorized: false,
        })

        const virtualConsole = new VirtualConsole()
        virtualConsole.on('error', () => {
          // No-op to skip console errors.
        })
        const dom = new JSDOM(res, { virtualConsole })

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

        locale = dom.window.document.documentElement.lang

        log(`✅ Downloaded\tBrightData for ${url}`, 'info')
        downloadMethod = 'brightdata'
      } catch (e) {
        log(`❌ Error\tCannot Download BrightData for ${url}`, 'info')
      }
    }

    // 3. try naive fetch as Googlebot
    if (body === '') {
      try {
        log(`⏳ Downloading\tNaive for ${url}`, 'info')
        const res = await timedFetch(url, 30000)
        body = await res.text()
        if (body?.toString().trim() === '') {
          throw new Error('😵 Naive Download is empty')
        }
        log(`✅ Downloaded\tNaive for ${url}`, 'info')
        downloadMethod = 'naive googlebot'
      } catch (e) {
        log(`❌ Error\tCannot Download Naive for ${url}`, 'info')
      }
    }

    // 4. final fallback, use playwright (very slow)
    if (
      body === '' ||
      body.toLowerCase().includes('enable javascript') ||
      body.toLowerCase().includes('have javascript enabled') // mastodon
    ) {
      try {
        log(`⏳ Downloading\tDefault for ${url}`, 'info')
        const browser = await playwright.chromium.launch()
        const context = await browser.newContext()
        const page = await context.newPage()
        await page.goto(url)
        // try to get .columns-area, if not, get body. This is for Mastodon
        try {
          body = await page.innerText('.columns-area')
        } catch (e) {
          body = await page.innerText('body')
        }
        locale = await page.getAttribute('html', 'lang')
        await browser.close()
        if (body?.toString().trim() === '') {
          throw new Error('😵 Default Download is empty')
        }
        log(`✅ Downloaded\tDefault for ${url}`, 'info')
        downloadMethod = 'playwright'
      } catch (e) {
        log(`❌ Error\tCannot Download Default for ${url}, ${e}`, 'info')
        body = 'error'
      }
    }
  }

  if (!commentBodyAlreadyExists) {
    // 5. Download comments
    try {
      log(`⏳ Downloading\tComment for ${commentUrl}`, 'info')
      const res = await timedFetch(commentUrl, 30000)

      // get all innerText of all comments
      const dom = new JSDOM(await res.text())
      commentBody = dom.window.document.body.textContent
      if (commentBody?.toString().trim() === '') {
        throw new Error('😵 Naive Download is empty')
      }
      commentLocale = dom.window.document.documentElement.lang
      log(`✅ Downloaded\tComment for ${url}`, 'info')
    } catch (e) {
      log(`❌ Error\tCannot Download Comment for ${url}`, 'info')
    }
  }

  const origin = sanitize(body)
  const comment = sanitize(commentBody)

  if (locale === '') {
    locale = 'en'
  }

  try {
    locale = locale.split('-')[0]
  } catch (e) {
    // do nothing
  }

  try {
    return await db.summary
      .findFirstOrThrow({
        where: {
          originLink: url,
          originLocale: locale,
        },
      })
      .then(async (summary) => {
        // if summary exists, update the content
        if (summary) {
          await db.summary.update({
            where: {
              id: summary.id,
            },
            data: {
              originBody: origin,
              commentBody: comment,
              originLink: url,
              originLocale: locale,
              commentLink: commentUrl,
              commentLocale,
              downloadMethod,
            },
          })
          log(`✅ Saved\t${url}`, 'info')
          return summary
        }
      })
  } catch (e) {
    log(`❌ Error\tCannot Save ${url}, ${locale}, ${e}`, 'info')
    return null
  }
}
