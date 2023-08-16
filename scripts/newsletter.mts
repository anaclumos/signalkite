import { newsletterId, password, server, username, subjectLengthLimit } from './config.mjs'
import { Story } from './type.mjs'
import {
  LOCAL_ADVERTISE_FIRST,
  LOCAL_ADVERTISE_SECOND,
  LOCAL_CONTACT,
  LOCAL_FEEDBACK,
  LOCAL_REACTIONS,
  LOCAL_TODAYS_HN,
  LOCAL_SHARE,
  LOCAL_HACKERNEWS_SUMMARY,
} from './default.mjs'
import { LinguineCore, LinguineList } from './linguine.mjs'
import { log } from './util.mjs'

export const scheduleNewsletter = async (localeStories: Record<string, Story[]>) => {
  log('📧 Scheduling Newsletter...', 'info')
  for (let i = 0; i < LinguineList.length; i++) {
    const locale = LinguineList[i]
    await createCampaign(locale, localeStories[locale])
  }
}

export const createDocHead = (locale: string, title: string, day = new Date()) => {
  return `<head>
  <meta property="og:title" content="${title}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://og.cho.sh/api/og/?title=${encodeURI(title)}&subheading=${encodeURI(
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
  return `<a href="https://airtable.com/appLfbX7pNQxpBx00/shrfpPSEbLVSXz4r7" target="_blank" rel="noopener noreferrer">
    <img src="https://github.com/anaclumos/heimdall/assets/31657298/397a222c-dcb9-41ce-b14c-da2c0849083b" alt="sponsor" width="150"/>
  </a>\n\n`
}

const createFooter = (locale: string) => {
  return `---\n\n- ${LOCAL_ADVERTISE_FIRST[locale]}\n- ${LOCAL_ADVERTISE_SECOND[locale]}\n- ${LOCAL_CONTACT[locale]}`
}

const createCampaign = async (locale: string, stories: Story[]) => {
  const timeToSend = new Date()
  timeToSend.setHours(timeToSend.getHours() + 1)
  timeToSend.setMinutes(newsletterId[locale])
  timeToSend.setSeconds(0)
  timeToSend.setMilliseconds(0)

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
        body: createHeader(locale) + createContent(locale, stories, true) + createFooter(locale),
        altbody: createHeader(locale) + createContent(locale, stories, true) + createFooter(locale),
        from_email: `${LOCAL_TODAYS_HN[locale]} <heimdall@newsletters.cho.sh>`,
        lists: [newsletterId[locale]],
        send_at: timeToSend.toISOString(),
        template_id: ['ja', 'zh-Hans', 'zh-Hant'].includes(locale) ? 3 : 1,
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
