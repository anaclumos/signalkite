export const LinguineProvider = {
  BING: 'BING',
  GOOGLE: 'GOOGLE',
  DEEPL: 'DEEPL',
} as const

// ['ar', 'bn', 'cs', 'da', 'de', 'el', 'en', 'es', 'fi', 'fr', 'he', 'hi', 'hu', 'id', 'it', 'jp', 'ko', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sk', 'sv', 'ta', 'th', 'tr', 'zh-Hans', 'zh-Hant']

export const LinguineCore = {
  ar: { name: 'Arabic', provider: 'BING', native: 'العربية' },
  bn: { name: 'Bengali', provider: 'BING', native: 'বাংলা' },
  cs: { name: 'Czech', provider: 'DEEPL', native: 'čeština' },
  da: { name: 'Danish', provider: 'DEEPL', native: 'dansk' },
  de: { name: 'German', provider: 'DEEPL', native: 'Deutsch' },
  el: { name: 'Greek', provider: 'DEEPL', native: 'Ελληνικά' },
  en: { name: 'English', provider: 'DEEPL', native: 'English' },
  es: { name: 'Spanish', provider: 'DEEPL', native: 'español' },
  fi: { name: 'Finnish', provider: 'DEEPL', native: 'suomi' },
  fr: { name: 'French', provider: 'DEEPL', native: 'français' },
  he: { name: 'Hebrew', provider: 'BING', native: 'עברית' },
  hi: { name: 'Hindi', provider: 'BING', native: 'हिंदी' },
  hu: { name: 'Hungarian', provider: 'DEEPL', native: 'magyar' },
  id: { name: 'Indonesian', provider: 'DEEPL', native: 'Bahasa Indonesia' },
  it: { name: 'Italian', provider: 'DEEPL', native: 'italiano' },
  ja: { name: 'Japanese', provider: 'DEEPL', native: '日本語' },
  ko: { name: 'Korean', provider: 'DEEPL', native: '한국어' },
  nl: { name: 'Dutch', provider: 'DEEPL', native: 'Nederlands' },
  nb: { name: 'Norwegian', provider: 'DEEPL', native: 'Norsk Bokmål' },
  pl: { name: 'Polish', provider: 'DEEPL', native: 'polski' },
  pt: { name: 'Portuguese', provider: 'DEEPL', native: 'português' },
  ro: { name: 'Romanian', provider: 'DEEPL', native: 'română' },
  ru: { name: 'Russian', provider: 'DEEPL', native: 'русский' },
  sk: { name: 'Slovak', provider: 'DEEPL', native: 'slovenčina' },
  sv: { name: 'Swedish', provider: 'DEEPL', native: 'svenska' },
  ta: { name: 'Tamil', provider: 'BING', native: 'தமிழ்' },
  th: { name: 'Thai', provider: 'BING', native: 'ไทย' },
  tr: { name: 'Turkish', provider: 'DEEPL', native: 'Türkçe' },
  'zh-Hans': {
    name: 'Chinese Simplified',
    provider: 'DEEPL',
    native: '中文 (简体中文)',
  },
  'zh-Hant': {
    name: 'Chinese Traditional',
    provider: 'BING',
    native: '中文 (繁體)',
  },
}

// export const LinguineList = Object.keys(LinguineCore)

export const LinguineList = ['hi', 'bn', 'ta', 'th']
