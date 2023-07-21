// To access your database
// Append api/* to import from api and web/* to import from web

import { LinguineConfig } from './Linguine'
import { translate } from './tools/translate'

export default async () => {
  const readline = require('readline').createInterface({
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
    Object.keys(LinguineConfig).map(async (locale) => {
      const translation = await translate([String(word)], 'en', locale)
      translatedMap[locale] = translation[0]
    })
  )

  console.log(translatedMap)

  const fs = require('fs')
  // create new file
  fs.writeFile(`${word}.json`, JSON.stringify(translatedMap), function (err) {
    if (err) throw err
    console.log('Saved!')
  })
}
