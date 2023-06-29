import { logger } from 'api/src/lib/logger'

export const log = (message: string, level: 'info' | 'error' = 'info') => {
  if (process.env.NODE_ENV === 'production') {
    if (level === 'info') {
      logger.info(message)
    } else {
      logger.error(message)
    }
  } else {
    console.log(message)
  }
}

export const throttle = async (minimum: number = 1, maximum: number = 10) => {
  await new Promise((r) =>
    setTimeout(r, Math.floor(Math.random() * (maximum - minimum)) + minimum)
  )
}

export const sanitize = (text: string) => {
  return text
    .replaceAll('\n', ' ')
    .replaceAll('\t', ' ')
    .replaceAll('\r', ' ')
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll(/&nbsp;/g, ' ')
    .replaceAll(/&amp;/g, '&')
    .replaceAll(/&quot;/g, '"')
    .replaceAll(/&apos;/g, "'")
    .replaceAll(/&lt;/g, '<')
    .replaceAll(/&gt;/g, '>')
    .replaceAll(/&cent;/g, '¢')
    .replaceAll(/&pound;/g, '£')
    .replaceAll(/&yen;/g, '¥')
    .replaceAll(/&euro;/g, '€')
    .replaceAll(/&copy;/g, '©')
    .replaceAll(/&reg;/g, '®')
    .replaceAll(/&trade;/g, '™')
    .replaceAll(/&times;/g, '×')
    .replaceAll(/&divide;/g, '÷')
    .replaceAll(/&para;/g, '¶')
    .replaceAll(/&sect;/g, '§')
    .replaceAll(/&bull;/g, '•')
    .replaceAll(/&hellip;/g, '…')
    .replaceAll(/&ndash;/g, '–')
    .replaceAll(/&mdash;/g, '—')
    .replaceAll(/&lsquo;/g, '‘')
    .replaceAll(/&rsquo;/g, '’')
    .replaceAll(/&sbquo;/g, '‚')
    .replaceAll(/&ldquo;/g, '“')
    .replaceAll(/&rdquo;/g, '”')
    .replaceAll('\u0000', '')
    .trim()
}
