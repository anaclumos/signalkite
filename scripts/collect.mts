import { log, sanitize } from './util.mjs'
import {
  tryDownloadingAsGooglebot,
  tryDownloadingPdf,
  tryDownloadingTwitter,
  tryDownloadingWithPlaywright,
  tryDownloadingYoutube,
} from './collectionStrategies.mjs'

export const collect = async (url: string, count = 0): Promise<string> => {
  log(`📥 Downloading\t${url}`, 'info')

  if (url === '') return ''

  if (count > 5) {
    log(`❌ Error\tDownload Failed 5 times ${url}`, 'error')
    return ''
  }

  let body = ''

  try {
    body = await tryDownloadingTwitter(url, body)
    body = await tryDownloadingYoutube(url, body)
    body = await tryDownloadingWithPlaywright(url, body)
    body = await tryDownloadingAsGooglebot(url, body)
    body = await tryDownloadingPdf(url, body)
  } catch (e) {
    log(`❌ Error\tDownload All Failed ${url}`, 'error')
    await new Promise((resolve) => setTimeout(resolve, 5000))
    body = await collect(url, count + 1)
  }

  if (body.length === 0) log(`❌ Error\tDownload All Failed ${url}`, 'error')

  return sanitize(body)
}
