import { collect } from './collect.mjs'
import { Story } from './type.mjs'
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
      log(`✅ Origin\t ${stories[i].originLink}`, 'info')
    } else {
      log(`💘 Body Exists\t ${stories[i].title}`, 'info')
    }
    if (!stories[i].commentBody) {
      stories[i].commentBody = await collect(stories[i].commentLink)
      log(`✅ Comment\t ${stories[i].commentLink}`, 'info')
    } else {
      log(`💘 Comm Exists\t ${stories[i].commentLink}`, 'info')
    }
  }

  console.log(JSON.stringify(stories, null, 2))
}

main().then(() => process.exit(0))
