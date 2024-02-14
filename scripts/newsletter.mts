import { newsletterId, newsletterDelay, password, server, username, subjectLengthLimit } from './config.mjs'
import { Story } from './type.mjs'
import { LOCAL_STARBUCKS, LOCAL_REACTIONS, LOCAL_TODAYS_HN, LOCAL_HN_SUMMARY } from './default.mjs'
import { LinguineCore, LinguineList } from './linguine.mjs'
import { log } from './util.mjs'
import { getAdImgHtml, storyAd } from './ad.mjs'

export const scheduleHnNewsletter = async (localeStories: Record<string, Story[]>) => {
  log('📧 Scheduling Newsletter...', 'info')
  for (let i = 0; i < LinguineList.length; i++) {
    const locale = LinguineList[i]
    await createHnCampaign(locale, localeStories[locale])
  }
}

export const createHnDocHead = (locale: string, title: string, day = new Date()) => {
  return `<head>
  <meta property="og:title" content="${title?.replaceAll('"', "'")}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://og.cho.sh/api/og/?title=${encodeURIComponent(
    title
  )}&subheading=${encodeURIComponent(
    day.toLocaleDateString(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) +
      ': ' +
      LOCAL_HN_SUMMARY[locale]
  )}" />
</head>`
}

const createHnPreview = (story: Story) => {
  return `<div style="display: none;">
  ${story.originSummary.join(' ') ?? ''}
  </div>\n\n`
}

const createHnCampaign = async (locale: string, stories: Story[]) => {
  const ONE_MINUTE = 60 * 1000
  const timeToSend = new Date(new Date().getTime() + ONE_MINUTE * newsletterDelay[locale] + ONE_MINUTE * 30)

  const day = new Date().toISOString().split('T')[0]

  let subject =
    `🗞️ ${stories[0].title}`.length <= subjectLengthLimit
      ? `🗞️ ${stories[0].title}`
      : `🗞️ HN (${LinguineCore[locale].native}) ${day}`

  subject = day === storyAd.day ? `🗞️ ${storyAd[locale].title}` : subject

  try {
    log(`📧 Creating\t${day} ${locale}`, 'info')
    const res = await fetch(server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
      },
      body: JSON.stringify({
        name: `${day} ${locale}`,
        subject: subject,
        type: 'regular',
        content_type: 'markdown',
        body:
          createHnPreview(day === storyAd.day ? storyAd[locale] : stories[0]) + createHnContent(locale, stories, true),
        altbody: createHnContent(locale, stories, true),
        from_email: `${LOCAL_TODAYS_HN[locale]} <hello@newsletters.cho.sh>`,
        lists: [newsletterId[locale]],
        send_at: timeToSend.toISOString(),
        template_id: getTemplateId(locale),
      }),
    })
    log(`💌 Creating\t${day} ${locale}`, 'info')

    const response = await res.json()

    await fetch(server + '/' + response.data.id + '/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
      },
      body: JSON.stringify({
        status: 'scheduled',
      }),
    })
    log(`📮 Scheduled\t${day} ${locale}`, 'info')
  } catch (e) {
    log(e, 'error')
  }
}

export const createHnContent = (locale: string, stories: Story[], isEmail = false, day = new Date()) => {
  let content = isEmail
    ? `# [${day.toISOString().split('T')[0]}](https://hn.cho.sh${locale !== 'en' ? '/' + locale : ''}/${new Date()
        .toISOString()
        .split('T')[0]
        .replaceAll('-', '/')}@TrackLink)\n\n`
    : `---\nslug: '/${day.toISOString().split('T')[0].replaceAll('-', '/')}'\n---\n\n# ${
        day.toISOString().split('T')[0]
      }\n\n`
  if (day.toISOString().split('T')[0] === storyAd.day) {
    content += `## [${storyAd[locale].title}](${storyAd[locale].originLink}@TrackLink) <sup style="color: #888888;">ad</sup>\n\n`
    for (let j = 0; j < storyAd[locale].originSummary.length; j++) {
      content += `- ${storyAd[locale].originSummary[j]}\n`
    }
  }
  for (let i = 0; i < stories.length; i++) {
    const story = stories[i]
    const h2link = isEmail
      ? `## [${story.title}](${story.originLink}@TrackLink)`
      : `## [${story.title}](${story.originLink})`

    const h3link = isEmail
      ? `### [${LOCAL_REACTIONS[locale]}](${story.commentLink}@TrackLink)`
      : `### [${LOCAL_REACTIONS[locale]}](${story.commentLink})`

    content += story.originLink !== undefined ? `${h2link}\n\n` : `## ${story.title}\n\n`

    for (let j = 0; j < story.originSummary.length; j++) {
      content += `- ${story.originSummary[j]}\n`
    }
    content += story.commentLink !== undefined ? `\n${h3link}\n\n` : `\n### ${LOCAL_REACTIONS[locale]}\n\n`

    for (let j = 0; j < story.commentSummary.length; j++) {
      content += `- ${story.commentSummary[j]}\n`
    }
    content += '\n'
  }

  if (!isEmail) {
    content += createHnDocHead(locale, stories[0].title, day) + '\n'
  }

  return content
}

const getTemplateId = (locale: string) => {
  const NO_WORD_WRAP = 3
  const RTL = 5
  const DEFAULT = 1
  if (['ja', 'zh-Hans', 'zh-Hant'].includes(locale)) return NO_WORD_WRAP
  if (['he', 'ar'].includes(locale)) return RTL
  return DEFAULT
}
