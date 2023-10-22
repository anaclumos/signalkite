import { newsletterId, newsletterDelay, password, server, username, subjectLengthLimit } from './config.mjs'
import { Story } from './type.mjs'
import { LOCAL_STARBUCKS, LOCAL_REACTIONS, LOCAL_TODAYS_HN, LOCAL_HACKERNEWS_SUMMARY } from './default.mjs'
import { LinguineCore, LinguineList } from './linguine.mjs'
import { log } from './util.mjs'
import { getAdImgHtml } from './ad.mjs'

export const scheduleNewsletter = async (localeStories: Record<string, Story[]>) => {
  log('📧 Scheduling Newsletter...', 'info')
  for (let i = 0; i < LinguineList.length; i++) {
    const locale = LinguineList[i]
    await createCampaign(locale, localeStories[locale])
  }
}

export const createDocHead = (locale: string, title: string, day = new Date()) => {
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
      LOCAL_HACKERNEWS_SUMMARY[locale]
  )}" />
</head>`
}

const createHeader = (locale: string) => {
  return getAdImgHtml('https://raw.githubusercontent.com/anaclumos/heimdall/main/static/img/sponsor.png') + '\n\n'
}

const createPreview = (story: Story) => {
  return `<div style="display: none;">
  ${story.originSummary.join(' ') ?? ''}
  </div>`
}

const createFooter = (locale: string) => {
  return `---\n\n[${LOCAL_STARBUCKS[locale]}](https://go.cho.sh/hn-cho-sh-bring-a-friend@TrackLink)\n\n`
}

const createCampaign = async (locale: string, stories: Story[]) => {
  const ONE_MINUTE = 60 * 1000
  const timeToSend = new Date(new Date().getTime() + ONE_MINUTE * newsletterDelay[locale] + ONE_MINUTE * 30)

  const subject =
    `🗞️ ${stories[0].title}`.length <= subjectLengthLimit
      ? `🗞️ ${stories[0].title}`
      : `🗞️ HN (${LinguineCore[locale].native}) ${new Date().toISOString().split('T')[0]}`

  try {
    log(`📧 Creating\t${new Date().toISOString().split('T')[0]} ${locale}`, 'info')
    const res = await fetch(server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
      },
      body: JSON.stringify({
        name: `${new Date().toISOString().split('T')[0]} ${locale}`,
        subject: subject,
        type: 'regular',
        content_type: 'markdown',
        body:
          createPreview(stories[0]) +
          createHeader(locale) +
          createContent(locale, stories, true) +
          createFooter(locale),
        altbody: createHeader(locale) + createContent(locale, stories, true) + createFooter(locale),
        from_email: `${LOCAL_TODAYS_HN[locale]} <hello@newsletters.cho.sh>`,
        lists: [newsletterId[locale]],
        send_at: timeToSend.toISOString(),
        template_id: getTemplateId(locale),
      }),
    })
    log(`💌 Creating\t${new Date().toISOString().split('T')[0]} ${locale}`, 'info')

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
    log(`📮 Scheduled\t${new Date().toISOString().split('T')[0]} ${locale}`, 'info')
  } catch (e) {
    log(e, 'error')
  }
}

export const createContent = (locale: string, stories: Story[], isEmail = false, day = new Date()) => {
  let content = isEmail
    ? `# [${day.toISOString().split('T')[0]}](https://hn.cho.sh${locale !== 'en' ? '/' + locale : ''}/${new Date()
        .toISOString()
        .split('T')[0]
        .replaceAll('-', '/')}@TrackLink)\n\n`
    : `---\nslug: '/${day.toISOString().split('T')[0].replaceAll('-', '/')}'\n---\n\n# ${
        day.toISOString().split('T')[0]
      }\n\n`
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
    content += createDocHead(locale, stories[0].title, day) + '\n'
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
