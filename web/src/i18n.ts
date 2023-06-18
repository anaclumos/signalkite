import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import arSA from './locales/ar-SA.json' // Arabic Saudi Arabia Arabic (Saudi Arabia)
import bnBD from './locales/bn-BD.json' // Bangla Bangladesh Bangla (Bangladesh)
import bnIN from './locales/bn-IN.json' // Bangla India Bangla (India)
import csCZ from './locales/cs-CZ.json' // Czech Czech Republic Czech (Czech Republic)
import daDK from './locales/da-DK.json' // Danish Denmark Danish (Denmark)
import deAT from './locales/de-AT.json' // German Austria Austrian German
import deCH from './locales/de-CH.json' // German Switzerland "Swiss" German
import deDE from './locales/de-DE.json' // German Germany Standard German (as spoken in Germany)
import elGR from './locales/el-GR.json' // Greek Greece Modern Greek
import enAU from './locales/en-AU.json' // English Australia Australian English
import enCA from './locales/en-CA.json' // English Canada Canadian English
import enGB from './locales/en-GB.json' // English United Kingdom British English
import enIE from './locales/en-IE.json' // English Ireland Irish English
import enIN from './locales/en-IN.json' // English India Indian English
import enNZ from './locales/en-NZ.json' // English New Zealand New Zealand English
import enUS from './locales/en-US.json' // English United States US English
import enZA from './locales/en-ZA.json' // English South Africa English (South Africa)
import esAR from './locales/es-AR.json' // Spanish Argentina Argentine Spanish
import esCL from './locales/es-CL.json' // Spanish Chile Chilean Spanish
import esCO from './locales/es-CO.json' // Spanish Columbia Colombian Spanish
import esES from './locales/es-ES.json' // Spanish Spain Castilian Spanish (as spoken in Central-Northern Spain)
import esMX from './locales/es-MX.json' // Spanish Mexico Mexican Spanish
import esUS from './locales/es-US.json' // Spanish United States American Spanish
import fiFI from './locales/fi-FI.json' // Finnish Finland Finnish (Finland)
import frBE from './locales/fr-BE.json' // French Belgium Belgian French
import frCA from './locales/fr-CA.json' // French Canada Canadian French
import frCH from './locales/fr-CH.json' // French Switzerland "Swiss" French
import frFR from './locales/fr-FR.json' // French France Standard French (especially in France)
import heIL from './locales/he-IL.json' // Hebrew Israel Hebrew (Israel)
import hiIN from './locales/hi-IN.json' // Hindi India Hindi (India)
import huHU from './locales/hu-HU.json' // Hungarian Hungary Hungarian (Hungary)
import idID from './locales/id-ID.json' // Indonesian Indonesia Indonesian (Indonesia)
import itCH from './locales/it-CH.json' // Italian Switzerland "Swiss" Italian
import itIT from './locales/it-IT.json' // Italian Italy Standard Italian (as spoken in Italy)
import jaJP from './locales/ja-JP.json' // Japanese Japan Japanese (Japan)
import koKR from './locales/ko-KR.json' // Korean Republic of Korea Korean (Republic of Korea)
import nlBE from './locales/nl-BE.json' // Dutch Belgium Belgian Dutch
import nlNL from './locales/nl-NL.json' // Dutch The Netherlands Standard Dutch (as spoken in The Netherlands)
import noNO from './locales/no-NO.json' // Norwegian Norway Norwegian (Norway)
import plPL from './locales/pl-PL.json' // Polish Poland Polish (Poland)
import ptBR from './locales/pt-BR.json' // Portugese Brazil Brazilian Portuguese
import ptPT from './locales/pt-PT.json' // Portugese Portugal European Portuguese (as written and spoken in Portugal)
import roRO from './locales/ro-RO.json' // Romanian Romania Romanian (Romania)
import ruRU from './locales/ru-RU.json' // Russian Russian Federation Russian (Russian Federation)
import skSK from './locales/sk-SK.json' // Slovak Slovakia Slovak (Slovakia)
import svSE from './locales/sv-SE.json' // Swedish Sweden Swedish (Sweden)
import taIN from './locales/ta-IN.json' // Tamil India Indian Tamil
import taLK from './locales/ta-LK.json' // Tamil Sri Lanka Sri Lankan Tamil
import thTH from './locales/th-TH.json' // Thai Thailand Thai (Thailand)
import trTR from './locales/tr-TR.json' // Turkish Turkey Turkish (Turkey)
import zhCN from './locales/zh-CN.json' // Chinese China Mainland China, simplified characters
import zhHK from './locales/zh-HK.json' // Chinese Hond Kong Hong Kong, traditional characters
import zhTW from './locales/zh-TW.json' // Chinese Taiwan Taiwan, traditional characters

const locales = {
  'ar-SA': { translation: arSA },
  'bn-BD': { translation: bnBD },
  'bn-IN': { translation: bnIN },
  'cs-CZ': { translation: csCZ },
  'da-DK': { translation: daDK },
  'de-AT': { translation: deAT },
  'de-CH': { translation: deCH },
  'de-DE': { translation: deDE },
  'el-GR': { translation: elGR },
  'en-AU': { translation: enAU },
  'en-CA': { translation: enCA },
  'en-GB': { translation: enGB },
  'en-IE': { translation: enIE },
  'en-IN': { translation: enIN },
  'en-NZ': { translation: enNZ },
  'en-US': { translation: enUS },
  'en-ZA': { translation: enZA },
  'es-AR': { translation: esAR },
  'es-CL': { translation: esCL },
  'es-CO': { translation: esCO },
  'es-ES': { translation: esES },
  'es-MX': { translation: esMX },
  'es-US': { translation: esUS },
  'fi-FI': { translation: fiFI },
  'fr-BE': { translation: frBE },
  'fr-CA': { translation: frCA },
  'fr-CH': { translation: frCH },
  'fr-FR': { translation: frFR },
  'he-IL': { translation: heIL },
  'hi-IN': { translation: hiIN },
  'hu-HU': { translation: huHU },
  'id-ID': { translation: idID },
  'it-CH': { translation: itCH },
  'it-IT': { translation: itIT },
  'ja-JP': { translation: jaJP },
  'ko-KR': { translation: koKR },
  'nl-BE': { translation: nlBE },
  'nl-NL': { translation: nlNL },
  'no-NO': { translation: noNO },
  'pl-PL': { translation: plPL },
  'pt-BR': { translation: ptBR },
  'pt-PT': { translation: ptPT },
  'ro-RO': { translation: roRO },
  'ru-RU': { translation: ruRU },
  'sk-SK': { translation: skSK },
  'sv-SE': { translation: svSE },
  'ta-IN': { translation: taIN },
  'ta-LK': { translation: taLK },
  'th-TH': { translation: thTH },
  'tr-TR': { translation: trTR },
  'zh-CN': { translation: zhCN },
  'zh-HK': { translation: zhHK },
  'zh-TW': { translation: zhTW },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    fallbackLng: 'en-US',
    resources: locales,
  })

export const allowedLocalesList = Object.keys(locales)

export default i18n
