import { newsletterId, password, server, username } from './config.mjs'
import { Story } from './type.mjs'
import { LOCAL_REACTIONS } from './default.mjs'
import { LinguineList } from './linguine.mjs'
import { log } from './util.mjs'

export const scheduleNewsletter = async (localeStories: Record<string, Story[]>) => {
  log('📧 Scheduling Newsletter...', 'info')
  for (let i = 0; i < LinguineList.length; i++) {
    const locale = LinguineList[i]
    await createCampaign(locale, localeStories[locale])
  }
}

const createCampaign = async (locale: string, stories: Story[]) => {
  const timeToSend = new Date()
  timeToSend.setHours(timeToSend.getHours() + 1)
  timeToSend.setMinutes(newsletterId[locale])
  timeToSend.setSeconds(0)
  timeToSend.setMilliseconds(0)

  try {
    log(`📧 Creating\t ${new Date().toISOString().split('T')[0]} ${locale}`, 'info')
    await fetch(server, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
      },
      body: JSON.stringify({
        name: `${new Date().toISOString().split('T')[0]} ${locale}`,
        subject: `🗞️ ${stories[0].title} (${new Date().toISOString().split('T')[0]})`,
        type: 'regular',
        content_type: 'markdown',
        body: createContent(locale, stories),
        altbody: createContent(locale, stories),
        lists: [newsletterId[locale]],
        send_at: timeToSend.toISOString(),
      }),
    })
    log(`💌 Creating\t ${new Date().toISOString().split('T')[0]} ${locale}`, 'info')
  } catch (e) {
    log(e, 'error')
  }
}

export const createContent = (locale: string, stories: Story[]) => {
  const today = new Date()
  let content = `# ${new Date().toISOString().split('T')[0]}\n\n`

  for (let i = 0; i < stories.length; i++) {
    const story = stories[i]
    content += `## [${story.title}](${story.originLink})\n\n`
    for (let j = 0; j < story.originSummary.length; j++) {
      content += `- ${story.originSummary[j]}\n`
    }
    content += `\n### [${LOCAL_REACTIONS[locale]}](${story.commentLink})\n\n`
    for (let j = 0; j < story.commentSummary.length; j++) {
      content += `- ${story.commentSummary[j]}\n`
    }
    content += '\n\n'
  }
  return content
}
