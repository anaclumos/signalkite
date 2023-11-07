import { TranslationServiceClient as GoogleTranslate } from '@google-cloud/translate'

import * as deepl from 'deepl-node'
import type {
  SourceLanguageCode as DeeplSourceLanguageCode,
  TargetLanguageCode as DeeplTargetLanguageCode,
  TextResult as DeeplTextResult,
} from 'deepl-node'
import { v4 as uuidv4 } from 'uuid'

import { LinguineCore, LinguineProvider } from './linguine.mjs'

export const translate = async ({
  text,
  source,
  target,
}: {
  text: string[]
  source: string
  target: string
}): Promise<string[]> => {
  if (source === target) {
    return text
  }

  if (text.length === 0) {
    return []
  }

  const { provider } = LinguineCore[target]

  if (provider === LinguineProvider.GOOGLE) {
    if (target === 'mni') target = 'mni-Mtei'

    const GOOGLE_TRANSLATE = new GoogleTranslate({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_TRANSLATE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_TRANSLATE_PRIVATE_KEY.split(String.raw`\n`).join('\n'),
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
    if (target === 'zh-Hant') target = 'zh-TW'
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
    if (target === 'zh-CN' || target === 'zh-Hans') target = 'zh'
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
