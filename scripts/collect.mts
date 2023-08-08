import { log, sanitize } from './util.mjs'
import {
  tryDownloadingAsGooglebot,
  tryDownloadingPdf,
  tryDownloadingTwitter,
  tryDownloadingWithPlaywright,
  tryDownloadingWithPuppeteer,
  tryDownloadingYoutube,
} from './collectionStrategies.mjs'

export const collect = async (url: string): Promise<string> => {
  log(`📥 Downloading\t${url}`, 'info')

  if (url === '') return ''

  let body = ''

  if (url.includes('news.ycombinator.com')) {
    body = await tryDownloadingAsGooglebot(url, body)
  }

  body = await tryDownloadingTwitter(url, body)
  body = await tryDownloadingYoutube(url, body)
  body = await tryDownloadingWithPuppeteer(url, body)
  body = await tryDownloadingWithPlaywright(url, body)
  body = await tryDownloadingAsGooglebot(url, body)
  body = await tryDownloadingPdf(url, body)

  if (body.length === 0) log(`❌ Error\tDownload All Failed ${url}`, 'error')

  return sanitize(body)
}
