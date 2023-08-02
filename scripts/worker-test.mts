import fs from 'fs'

import { updateHN } from './update.mjs'
import { collect } from './collect.mjs'
import { Story } from './type.mjs'
import { summarize } from './summarize.mjs'
import { LinguineList } from './linguine.mjs'
import { translate } from './translate.mjs'
import { createContent, scheduleNewsletter } from './newsletter.mjs'
import { log } from './util.mjs'

const main = async () => {
  const story: Story = {
    id: '36957678',
    title: 'A room-temperature superconductor? New developments',
    originLink: 'https://www.science.org/content/blog-post/room-temperature-superconductor-new-developments',
    originBody: '',
    commentLink: 'https://news.ycombinator.com/item?id=36957678',
    commentBody: '',
    originSummary: [],
    commentSummary: [],
    points: 921,
    commentCount: 664,
    retryCount: 0,
    time: 1690905177,
  }

  const stories = [story]

  for (let i = 0; i < stories.length; i++) {
    if (!stories[i].originBody) {
      stories[i].originBody = await collect(stories[i].originLink)
    } else {
      log(`💘 Body Exists\t ${stories[i].title}`, 'info')
    }
    if (!stories[i].commentBody) {
      stories[i].commentBody = await collect(stories[i].commentLink)
    } else {
      log(`💘 Comm Exists\t ${stories[i].commentLink}`, 'info')
    }
  }

  console.log(JSON.stringify(stories, null, 2))
}

main().then(() => process.exit(0))
