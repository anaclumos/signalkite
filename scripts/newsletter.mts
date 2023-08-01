import { newsletterId, password, server, username } from './config.mjs'
import { Story } from './type.mjs'
import {
  LOCAL_ADVERTISE_FIRST,
  LOCAL_ADVERTISE_SECOND,
  LOCAL_CONTACT,
  LOCAL_FEEDBACK,
  LOCAL_REACTIONS,
  LOCAL_SHARE,
  LOCAL_SPONSOR,
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

const createHeader = (locale: string) => {
  return `[${LOCAL_SHARE[locale]}](https://hn.cho.sh${locale !== 'en' ? '/' + locale : ''}/${new Date()
    .toISOString()
    .split('T')[0]
    .replaceAll('-', '/')}) • [${LOCAL_FEEDBACK[locale]}](https://airtable.com/shrty7OlhrLuBC6UX) • [${
    LOCAL_SPONSOR[locale]
  }](https://github.com/sponsors/anaclumos)\n\n`
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

  const title =
    `🗞️ ${stories[0].title}`.length <= 70
      ? `🗞️ ${stories[0].title}`
      : `🗞️ HN (${LinguineCore[locale].native}) ${new Date().toISOString().split('T')[0]}`

  try {
    log(`📧 Creating\t ${new Date().toISOString().split('T')[0]} ${locale}`, 'info')
    const res = await fetch(server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
      },
      body: JSON.stringify({
        name: `${new Date().toISOString().split('T')[0]} ${locale}`,
        subject: title,
        type: 'regular',
        content_type: 'markdown',
        body: createHeader(locale) + createContent(locale, stories) + createFooter(locale),
        altbody: createHeader(locale) + createContent(locale, stories) + createFooter(locale),
        lists: [newsletterId[locale]],
        send_at: timeToSend.toISOString(),
      }),
    })
    log(`💌 Creating\t ${new Date().toISOString().split('T')[0]} ${locale}`, 'info')

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
    log(`📮 Scheduled\t ${new Date().toISOString().split('T')[0]} ${locale}`, 'info')
  } catch (e) {
    log(e, 'error')
  }
}

export const createContent = (locale: string, stories: Story[]) => {
  let content = `# ${new Date().toISOString().split('T')[0]}\n\n`
  for (let i = 0; i < stories.length; i++) {
    const story = stories[i]
    content += story.originLink !== undefined ? `## [${story.title}](${story.originLink})\n\n` : `## ${story.title}\n\n`
    for (let j = 0; j < story.originSummary.length; j++) {
      content += `- ${story.originSummary[j]}\n`
    }
    content +=
      story.commentLink !== undefined
        ? `\n#### [${LOCAL_REACTIONS[locale]}](${story.commentLink})\n\n`
        : `\n#### ${LOCAL_REACTIONS[locale]}\n\n`
    for (let j = 0; j < story.commentSummary.length; j++) {
      content += `- ${story.commentSummary[j]}\n`
    }
    content += '\n\n'
  }
  return content
}
