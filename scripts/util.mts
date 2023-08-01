export const log = (message: string, level: 'info' | 'error' = 'info') => {
  if (level === 'error') {
    console.error(message)
  } else {
    console.log(message)
  }
}

export const sanitize = (text: string) => {
  if (!text) return ''
  if (text === 'error') return ''
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
    .replaceAll('  ', '')
    .replaceAll('\n\n', '\n')
    .replaceAll('Hacker News new | past | comments | ask | show | jobs | submit login', '')
    .replaceAll('Guidelines | FAQ | Lists | API | Security | Legal | Apply to YC | Contact Search:', '')
    .replaceAll(' hour ago | root | parent | next [–]', '')
    .replaceAll(' hours ago | root | parent | next [–]', '')
    .replaceAll('hours ago | hide | past | favorite |', '')
    .replaceAll('N/A. ', '')
    .replaceAll('N/A.', '')
    .replaceAll('N/A', '')
    .trim()
}
