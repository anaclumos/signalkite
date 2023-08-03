import { LinguineCore } from './linguine.mjs'
import { translate } from './translate.mjs'

import fs from 'fs'

const main = async () => {
  const strings = {
    'First, may I have your email?': {
      message: 'First, may I have your email?',
    },
    'Next, what languages do you speak?': {
      message: 'Next, what languages do you speak?',
    },
    Subscribe: {
      message: 'Subscribe',
    },
    "Would you mind receiving updates on what I'm working on?": {
      message: "Would you mind receiving updates on what I'm working on?",
    },
  }

  const translatedMap = {}

  await Promise.all(
    Object.keys(LinguineCore).map(async (locale) => {
      const localeCopy = structuredClone(strings)
      // translate the values of the copy
      await Promise.all(
        Object.keys(localeCopy).map(async (key) => {
          const translation = await translate([localeCopy[key].message], 'en', locale)
          localeCopy[key].message = translation[0]
        })
      )
      // add the translated copy to the translatedMap
      translatedMap[locale] = localeCopy
    })
  )

  await Promise.all(
    Object.keys(translatedMap).map(async (locale) => {
      const path = `i18n/${locale}/code.json`
      const data = JSON.stringify(translatedMap[locale], null, 2)
      fs.writeFileSync(path, data)
    })
  )
}

main().then(() => process.exit(0))
