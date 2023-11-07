import { LinguineCore } from './linguine.mjs'
import { translate } from './translate.mjs'

import fs from 'fs'

const main = async () => {
  const strings = {
    'item.label.Free Starbucks ☕': {
      message: 'Free Starbucks ☕',
      description: 'Navbar item with label Free Starbucks ☕',
    },
  }

  const translatedMap = {}

  await Promise.all(
    Object.keys(LinguineCore).map(async (locale) => {
      const localeCopy = structuredClone(strings)
      // translate the values of the copy
      await Promise.all(
        Object.keys(localeCopy).map(async (key) => {
          const translation = await translate({ text: [localeCopy[key].message], source: 'en', target: locale })
          localeCopy[key].message = translation[0]
        })
      )
      translatedMap[locale] = localeCopy
    })
  )

  await Promise.all(
    Object.keys(translatedMap).map(async (locale) => {
      // const path = `i18n/${locale}/docusaurus-theme-classic/navbar.json`
      const path = `i18n/${locale}/code.json`
      // we must append to the file, not overwrite it
      const json = JSON.parse(fs.readFileSync(path, 'utf8'))
      const newJson = {
        ...json,
        ...translatedMap[locale],
      }
      fs.writeFileSync(path, JSON.stringify(newJson, null, 2))
    })
  )
}

main().then(() => process.exit(0))
