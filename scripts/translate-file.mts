import { LinguineCore } from './linguine.mjs'
import { translate } from './translate.mjs'

import fs from 'fs'
const main = async () => {
  const input = fs.readFileSync('scripts/input.txt', 'utf8')
  const translatedMap = {}

  await Promise.all(
    Object.keys(LinguineCore).map(async (locale) => {
      const translation = await translate({ text: [String(input)], source: 'en', target: locale })
      translatedMap[locale] = translation[0]
    })
  )

  console.log(translatedMap)
  fs.writeFileSync('scripts/output.json', JSON.stringify(translatedMap, null, 2))
}

main().then(() => process.exit(0))
