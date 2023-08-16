import { LinguineCore } from './linguine.mjs'
import { translate } from './translate.mjs'
import { createInterface } from 'readline'

const main = async () => {
  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  const word = await new Promise((resolve) => {
    readline.question('Enter a word: ', (word) => {
      resolve(word)
    })
  })

  readline.close()
  const translatedMap = {}

  await Promise.all(
    Object.keys(LinguineCore).map(async (locale) => {
      const translation = await translate([String(word)], 'en', locale)
      translatedMap[locale] = translation[0]
    })
  )

  console.log(translatedMap)
}

main().then(() => process.exit(0))
