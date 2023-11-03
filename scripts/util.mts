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

  if (text === "'") return ''
  if (text === "'") return ''
  if (text === "''") return ''
  if (text === "''") return ''
  if (text === '"') return ''
  if (text === '""') return ''
  if (text === '""') return ''

  if (text.startsWith('"') && text.endsWith('"')) {
    text = text.slice(1, -1)
  }
  if (text.startsWith("'") && text.endsWith("'")) {
    text = text.slice(1, -1)
  }

  return text
    .replaceAll(/[\u200B\u200C\u200D\u200E\u200F\uFEFF]/g, '')
    .replaceAll(' ', ' ')
    .replaceAll(' ', ' ')
    .replaceAll('️', '')
    .replaceAll('​', '')
    .replaceAll('‍', '')
    .replaceAll(' ', ' ')
    .replaceAll('️', '')
    .replaceAll('‍', '')
    .replaceAll(' ', ' ')
    .replaceAll(' ', ' ')
    .replaceAll(' ', ' ')
    .replaceAll(' ', ' ')
    .replaceAll(' ', ' ')
    .replaceAll(' ', ' ')
    .replaceAll(' ', ' ')
    .replaceAll(' ', ' ')
    .replaceAll(' ', ' ')
    .replaceAll(' ', ' ')
    .replaceAll('（', '(')
    .replaceAll('﻿', '')
    .replaceAll('）', ')')
    .replaceAll(' ', ' ')
    .replaceAll('‏', '')
    .replaceAll('‍', '')
    .replaceAll('  ', ' ')
    .replaceAll('<script>', '')
    .replaceAll('</script>', '')
    .replaceAll('\n', ' ')
    .replaceAll('  ', ' ')
    .replaceAll('  ', ' ')
    .replaceAll('  ', ' ')
    .replaceAll('  ', ' ')
    .replaceAll('  ', ' ')
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
    .replaceAll('Hacker News new', '')
    .replaceAll(' | new', '')
    .replaceAll(' | comments', '')
    .replaceAll(' | ask', '')
    .replaceAll(' | show', '')
    .replaceAll(' | jobs', '')
    .replaceAll(' | submit', '')
    .replaceAll(' | login', '')
    .replaceAll(' | ', '')
    .replaceAll('Hacker Newslogin', '')
    .replaceAll('Newslogin', '')
    .replaceAll('submit login', '')
    .replaceAll('submitlogin', '')
    .replaceAll('Attention Required!Cloudflare You are unable to access ', '')
    .replaceAll('Attention Required!, ', '')
    .replaceAll('Guidelines | FAQ | Lists | API | Security | Legal | Apply to YC | Contact Search:', '')
    .replaceAll('1 hour ago | ', '')
    .replaceAll('2 hours ago | ', '')
    .replaceAll('3 hours ago | ', '')
    .replaceAll('4 hours ago | ', '')
    .replaceAll('5 hours ago | ', '')
    .replaceAll('6 hours ago | ', '')
    .replaceAll('7 hours ago | ', '')
    .replaceAll('8 hours ago | ', '')
    .replaceAll('9 hours ago | ', '')
    .replaceAll('10 hours ago | ', '')
    .replaceAll('11 hours ago | ', '')
    .replaceAll('12 hours ago | ', '')
    .replaceAll('13 hours ago | ', '')
    .replaceAll('14 hours ago | ', '')
    .replaceAll('15 hours ago | ', '')
    .replaceAll('16 hours ago | ', '')
    .replaceAll('17 hours ago | ', '')
    .replaceAll('18 hours ago | ', '')
    .replaceAll('19 hours ago | ', '')
    .replaceAll('20 hours ago | ', '')
    .replaceAll('21 hours ago | ', '')
    .replaceAll('22 hours ago | ', '')
    .replaceAll('23 hours ago | ', '')
    .replaceAll('hide | ', '')
    .replaceAll('past | ', '')
    .replaceAll('favorite | ', '')
    .replaceAll('minutes ago | ', '')
    .replaceAll('minute ago | ', '')
    .replaceAll('parent | ', '')
    .replaceAll('prev | ', '')
    .replaceAll('next [–] ', '')
    .replaceAll('next | ', '')
    .replaceAll('root | ', '')
    .replaceAll('N/A. ', '')
    .replaceAll('N/A.', '')
    .replaceAll('N/A', '')
    .replaceAll('Attention Required! | Cloudflare, ', '')
    .replaceAll(
      "body{margin:0;padding:0}if (!navigator.cookieEnabled) { window.addEventListener('DOMContentLoaded', function () { var cookieEl = document.getElementById('cookie-alert'); cookieEl.style.display = 'block'; }) }",
      ''
    )
    .replaceAll('Please enable cookies', '')
    .replaceAll('Sorry, you have been blocked', '')
    .replaceAll('You are unable to access', '')
    .replaceAll(
      'Why have I been blocked? This website is using a security service to protect itself from online attacks. The action you just performed triggered the security solution. There are several actions that could trigger this block including submitting a certain word or phrase, a SQL command or malformed data. What can I do to resolve this? You can email the site owner to let them know you were blocked. Please include what you were doing when this page came up and the Cloudflare Ray ID found at the bottom of this page.',
      ''
    )
    .replaceAll('Your IP: Click to reveal', '')
    .replaceAll(
      '(function(){function d(){var b=a.getElementById("cf-footer-item-ip"),c=a.getElementById("cf-footer-ip-reveal");b&&"classList"in b&&(b.classList.remove("hidden"),c.addEventListener("click",function(){c.classList.add("hidden");a.getElementById("cf-footer-ip").classList.remove("hidden")}))}var a=document;document.addEventListener&&a.addEventListener("DOMContentLoaded",d)})();window._cf_translation = {};',
      ''
    )
    .replaceAll('Checking if the site connection is secure', '')
    .replaceAll('needs to review the security of your connection before proceeding.', '')
    .replaceAll('Ray ID:', '')
    .replaceAll('Performance & security by Cloudflare', '')
    .replaceAll('Show HN: ', '')
    .replaceAll('Ask HN: ', '')
    .replaceAll('Launch HN: ', '')
    .replaceAll('Tell HN: ', '')
    .replaceAll('- 서울경제', '')
    .replaceAll('- 조선비즈', '')
    .replaceAll('[단독]', '')
    .replaceAll('[포토]', '')
    .replaceAll('[강세 토픽]', '')
    .replaceAll(' : IT : 경제 : 뉴스', '')
    .trim()
    .slice(0, 100000)
}
