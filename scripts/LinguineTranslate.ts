import { TranslationServiceClient as GoogleTranslate } from '@google-cloud/translate'
import * as deepl from 'deepl-node'
import type {
  SourceLanguageCode as DeeplSourceLanguageCode,
  TargetLanguageCode as DeeplTargetLanguageCode,
  TextResult as DeeplTextResult,
} from 'deepl-node'
import { v4 as uuidv4 } from 'uuid'

import { LinguineConfig } from './LinguineConfig'
import { log } from './util'

export const translate = async (
  text: string,
  source: string,
  target: string
) => {
  if (source === target) {
    return text
  }

  const { provider } = LinguineConfig[target]

  if (provider === 'GOOGLE') {
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
      contents: [text],
      mimeType: 'text/plain',
      sourceLanguageCode: source,
      targetLanguageCode: target,
    }
    const [response] = await GOOGLE_TRANSLATE.translateText(request)

    return response.translations[0]?.translatedText
  } else if (provider === 'BING') {
    const key = process.env.BING_TRANSLATE_KEY
    const location = process.env.BING_TRANSLATE_REGION
    const endpoint = 'https://api.cognitive.microsofttranslator.com'
    const result = await fetch(
      `${endpoint}/translate?api-version=3.0&from=${source}&to=${target}`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': key,
          'Ocp-Apim-Subscription-Region': location,
          'Content-type': 'application/json',
          'X-ClientTraceId': uuidv4().toString(),
        },
        body: JSON.stringify([
          {
            text,
          },
        ]),
      }
    )
      .then((r) => r.json())
      .catch((e) => {
        throw e
      })

    return result[0]?.translations[0]?.text
  } else if (provider === 'DEEPL') {
    const translator = new deepl.Translator(process.env.DEEPL_API_KEY)

    if (target === 'zh-CN') target = 'zh'
    if (target === 'pt') target = 'pt-BR'
    if (target === 'en') target = 'en-US'

    const sourceLanguageCode = (source as DeeplSourceLanguageCode) || 'en'
    const targetLanguageCode = (target as DeeplTargetLanguageCode) || 'en-US'

    const result: DeeplTextResult = await translator
      .translateText(text, sourceLanguageCode, targetLanguageCode)
      .catch((e) => {
        throw e
      })
      .then((r) => r)
    return result.text
  }
}

export default async () => {
  const linguine = Object.keys(LinguineConfig)
  for (const target of linguine) {
    await translate(
      'Linguine Engine combines Google Translate, Azure Translate, and DeepL to translate 150+ languages, covering 99.9% of the global audience.',
      'en',
      target
    )
      .then(async (r) => {
        log(`✅\t${LinguineConfig[target].provider}\t${target}\t${r}`, 'info')
      })
      .catch(async (e) => {
        log(`🚫\t${LinguineConfig[target].provider}\t${target}\t${e}`, 'error')
      })
  }
}
