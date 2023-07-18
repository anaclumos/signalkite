import { TranslationServiceClient as GoogleTranslate } from '@google-cloud/translate'
import { createId } from '@paralleldrive/cuid2'
import { db } from 'api/src/lib/db'
import * as deepl from 'deepl-node'
import type {
  SourceLanguageCode as DeeplSourceLanguageCode,
  TargetLanguageCode as DeeplTargetLanguageCode,
  TextResult as DeeplTextResult,
} from 'deepl-node'
import { v4 as uuidv4 } from 'uuid'

import { LinguineConfig, LinguineProvider } from '../Linguine'

import { log } from './util'

export const translate = async (
  text: string[],
  source: string,
  target: string
) => {
  if (source === target) {
    return text
  }

  if (text.length === 0) {
    return []
  }

  const { provider } = LinguineConfig[target]

  if (provider === LinguineProvider.GOOGLE) {
    if (target === 'mni') target = 'mni-Mtei'

    const GOOGLE_TRANSLATE = new GoogleTranslate({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_TRANSLATE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_TRANSLATE_PRIVATE_KEY.split(
          String.raw`\n`
        ).join('\n'),
      },
    })
    const projectId = process.env.GOOGLE_TRANSLATE_PROJECT_ID
    const location = process.env.GOOGLE_TRANSLATE_LOCATION
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: text,
      mimeType: 'text/plain',
      sourceLanguageCode: source,
      targetLanguageCode: target,
    }
    const [response] = await GOOGLE_TRANSLATE.translateText(request)

    return response.translations.map((t) => t.translatedText)
  } else if (provider === LinguineProvider.BING) {
    text = await Promise.all(
      text.map(async (t, idx) => {
        await new Promise((resolve) => setTimeout(resolve, 1000 * idx))
        const result = await fetch(
          `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${source}&to=${target}`,
          {
            method: 'POST',
            headers: {
              'Ocp-Apim-Subscription-Key': process.env.BING_TRANSLATE_KEY,
              'Ocp-Apim-Subscription-Region': process.env.BING_TRANSLATE_REGION,
              'Content-type': 'application/json',
              'X-ClientTraceId': uuidv4().toString(),
            },
            body: JSON.stringify([
              {
                text: t,
              },
            ]),
          }
        )
          .then((r) => r.json())
          .catch((e) => {
            throw e
          })
        return result[0]?.translations[0]?.text
      })
    )
    return text
  } else if (provider === LinguineProvider.DEEPL) {
    const translator = new deepl.Translator(process.env.DEEPL_API_KEY)

    if (target === 'zh-CN') target = 'zh'
    if (target === 'pt') target = 'pt-BR'
    if (target === 'en') target = 'en-US'

    const sourceLanguageCode = (source as DeeplSourceLanguageCode) || 'en'
    const targetLanguageCode = (target as DeeplTargetLanguageCode) || 'en-US'

    const result: DeeplTextResult[] = await translator
      .translateText(text, sourceLanguageCode, targetLanguageCode)
      .catch((e) => {
        throw e
      })
      .then((r) => r)
    return result.map((r) => r.text)
  }
}

export const translateWithAssumption = async ({
  originLink,
  summaryLocale,
}: {
  originLink: string
  summaryLocale: string
}) => {
  // find from db
  const summary = await db.summary.findFirst({
    where: {
      originLink,
      summaryLocale,
    },
  })

  if (summary) {
    return summary
  }

  // find from db with different locale

  const summaryWithEnglish = await db.summary.findFirst({
    where: {
      originLink,
      summaryLocale: 'en',
    },
  })

  const summaryWithDifferentLocale = await db.summary.findFirst({
    where: {
      originLink,
    },
  })

  const translatedSummaryOrigin = await translate(
    JSON.parse(
      summaryWithEnglish.summaryOrigin ??
        summaryWithDifferentLocale.summaryOrigin ??
        '[]'
    ),
    summaryWithEnglish.summaryLocale ??
      summaryWithDifferentLocale.summaryLocale,
    summaryLocale
  )

  const translatedSummaryComment = await translate(
    JSON.parse(
      summaryWithEnglish.summaryComment ??
        summaryWithDifferentLocale.summaryComment ??
        '[]'
    ),
    summaryWithEnglish.summaryLocale ??
      summaryWithDifferentLocale.summaryLocale,
    summaryLocale
  )

  const translatedTitle = await translate(
    [summaryWithEnglish.title ?? summaryWithDifferentLocale.title ?? ''],
    summaryWithEnglish.summaryLocale ??
      summaryWithDifferentLocale.summaryLocale,
    summaryLocale
  )

  const translatedSummary = await db.summary.create({
    data: {
      ...summaryWithEnglish,
      id: createId(),
      title: translatedTitle[0],
      originLink,
      summaryLocale,
      summaryOrigin: JSON.stringify(translatedSummaryOrigin),
      summaryComment: JSON.stringify(translatedSummaryComment),
    },
  })

  return translatedSummary
}

export default async () => {
  const linguine = Object.keys(LinguineConfig)
  for (const target of linguine) {
    await translate(['Hello World!', 'We are the world!'], 'en', target)
      .then(async (r) => {
        log(
          `✅\t${LinguineConfig[target].provider}\t${target}\t${JSON.stringify(
            r
          )}`,
          'info'
        )
      })
      .catch(async (e) => {
        log(`🚫\t${LinguineConfig[target].provider}\t${target}\t${e}`, 'error')
      })
  }
}
