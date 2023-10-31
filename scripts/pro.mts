import fs from 'fs'
import { Resend } from 'resend'

import { updateNews } from './update.mjs'
import { collect } from './collect.mjs'
import { Story } from './type.mjs'
import { summarize } from './summarize.mjs'
import { translate } from './translate.mjs'
import { log, sanitize } from './util.mjs'
import Newsletter from './emails/NewsletterTemplate.js'
import { subscriptions } from './pro.alpha.mjs'

const MAX_RETRIES = 3
const RETRY_DELAY = 10_000

async function retryTranslation(func, args, maxRetries) {
  const { locale } = args
  let tryCount = 0
  while (tryCount < maxRetries) {
    try {
      return await func(...args)
    } catch (e) {
      log(`🤔 Retrying\t${locale}`, 'error')
      await new Promise((r) => setTimeout(r, RETRY_DELAY))
      tryCount++
    }
  }
  log(`🤬 Failed\t${locale}`, 'error')
  throw new Error('Failed to translate')
}

const sendEmail = async (obj: { email: string; query: string; serachResultLang: string; locale: string }) => {
  const { email, query, serachResultLang, locale } = obj
  let stories: Story[] = await updateNews({
    query,
    serachResultLang,
  })

  // const day = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const day = new Date().toISOString().split('T')[0]
  const path = `./pro/${serachResultLang}/${query}/records/${day}/${day}.${serachResultLang}.json`

  if (!fs.existsSync(path)) {
    fs.mkdirSync(`./pro/${serachResultLang}/${query}/records/${day}`, { recursive: true })
  } else {
    stories = JSON.parse(fs.readFileSync(path, 'utf8'))
  }

  // this is to throttle the requests
  for (let i = 0; i < stories.length; i++) {
    if (!stories[i].originBody) {
      stories[i].originBody = await collect(stories[i].originLink)
    } else {
      log(`💘 Body Exists\t${stories[i].title}`, 'info')
      stories[i].originBody = sanitize(stories[i].originBody)
    }
  }

  stories = await Promise.all(
    stories.map(async (s) => {
      return summarize(s)
    })
  )

  // Ensure that the title and summary are sanitized
  stories = stories.map((s) => {
    return {
      ...s,
      title: sanitize(s.title),
      originSummary: s.originSummary.map((s) => sanitize(s)),
    }
  })

  fs.writeFileSync(
    `./pro/${serachResultLang}/${query}/records/${day}/${day}.${serachResultLang}.json`,
    JSON.stringify(stories, null, 2) + '\n'
  )

  // locale -> Stories map
  const localeStories: Record<string, Story[]> = {}
  if (fs.existsSync(`./pro/${serachResultLang}/${query}/records/${day}/${day}.${locale}.json`)) {
    log(`💘 Tran Exists\t${locale}`)
    localeStories[locale] = JSON.parse(
      fs.readFileSync(`./pro/${serachResultLang}/${query}/records/${day}/${day}.${locale}.json`, 'utf8')
    )
  }
  localeStories[locale] = await Promise.all(
    stories.map(async (s) => {
      return {
        ...s,
        title: (await retryTranslation(translate, [[s.title], serachResultLang, locale], MAX_RETRIES))[0],
        originSummary: await retryTranslation(translate, [s.originSummary, serachResultLang, locale], MAX_RETRIES),
        originBody: '',
        commentBody: '',
      }
    })
  )

  // Ensure that the title and summary are sanitized
  stories = stories.map((s) => {
    return {
      ...s,
      title: sanitize(s.title),
      originSummary: s.originSummary.map((s) => sanitize(s)),
    }
  })

  fs.writeFileSync(
    `./pro/${serachResultLang}/${query}/records/${day}/${day}.${locale}.json`,
    JSON.stringify(localeStories[locale], null, 2) + '\n'
  )

  const resend = new Resend(process.env.RESEND_KEY)
  resend.emails.send({
    from: 'hello@newsletters.cho.sh',
    to: email,
    subject: day + ' ' + query,
    react: Newsletter({
      title: day,
      titleLink: '',
      content: localeStories[locale].map((story) => ({
        headline: story.title,
        link: story.originLink,
        bullets: story.originSummary,
      })),
      starbucks: '',
      locale,
      dir: ['he', 'ar'].includes(locale) ? 'rtl' : 'ltr',
    }),
  })
}

const main = async () => {
  for await (const s of subscriptions) {
    await sendEmail(s)
  }
}

main()
