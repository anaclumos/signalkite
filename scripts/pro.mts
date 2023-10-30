import fs from 'fs'
import { Resend } from 'resend'

import { updateNews } from './update.mjs'
import { collect } from './collect.mjs'
import { Story } from './type.mjs'
import { summarize } from './summarize.mjs'
import { translate } from './translate.mjs'
import { log, sanitize } from './util.mjs'
import Newsletter from './emails/NewsletterTemplate.js'

const MAX_RETRIES = 3
const RETRY_DELAY = 60_000 // 1 minute

const config = [
  {
    query: 'CRM',
    locale: 'en',
    email: 'anaclumos@gmail.com',
  },
  {
    query: 'CRM',
    locale: 'ko',
    email: 'anaclumos@gmail.com',
  },
  {
    query: 'Bitcoin',
    locale: 'ko',
    email: 'anaclumos@gmail.com',
  },
]

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

const sendEmail = async (obj: { email: string; query: string; locale: string }) => {
  const { email, query, locale } = obj
  let stories: Story[] = await updateNews({
    query: query,
  })

  // const day = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  const day = new Date().toISOString().split('T')[0]
  const path = `./pro/${query}/records/${day}/${day}.en.json`

  if (!fs.existsSync(path)) {
    fs.mkdirSync(`./pro/${query}/records/${day}`, { recursive: true })
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

  // locale -> Stories map
  const localeStories: Record<string, Story[]> = {}

  if (locale === 'en') {
    localeStories[locale] = stories
  }
  if (fs.existsSync(`./pro/${query}/records/${day}/${day}.${locale}.json`)) {
    log(`💘 Tran Exists\t${locale}`)
    localeStories[locale] = JSON.parse(fs.readFileSync(`./pro/${query}/records/${day}/${day}.${locale}.json`, 'utf8'))
  }
  localeStories[locale] = await Promise.all(
    stories.map(async (s) => {
      return {
        ...s,
        title: (await retryTranslation(translate, [[s.title], 'en', locale], MAX_RETRIES))[0],
        originSummary: await retryTranslation(translate, [s.originSummary, 'en', locale], MAX_RETRIES),
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
    `./pro/${query}/records/${day}/${day}.${locale}.json`,
    JSON.stringify(localeStories[locale], null, 2) + '\n'
  )

  const resend = new Resend(process.env.RESEND_KEY)
  resend.emails.send({
    from: 'hello@newsletters.cho.sh',
    to: email,
    subject: day + ' ' + query,
    react: Newsletter({
      title: day,
      content: localeStories[locale].map((story) => ({
        headline: story.title,
        link: story.originLink,
        bullets: story.originSummary,
        starbucks: '',
      })),
      locale,
      dir: ['he', 'ar'].includes(locale) ? 'rtl' : 'ltr',
    }),
  })
}

config.forEach(async (c) => {
  await sendEmail(c)
})
