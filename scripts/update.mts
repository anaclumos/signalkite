import { Story } from './type.mjs'
import { HACKER_NEWS_COUNT_PER_WORKER } from './config.mjs'
import rp from 'request-promise'

/**
 * Update Hacker News
 * Returns the top 5 stories from Hacker News that are not older than 24 hours
 * @returns {Promise<[]>}
 * @example
 * const bestStories = await updateHN()
 */
export const updateHN = async (): Promise<Story[]> => {
  let hnResponse = await fetch('https://hacker-news.firebaseio.com/v0/beststories.json').then((res) => res.json())
  let bestStories: Story[] = await Promise.all(
    hnResponse.map(async (id, idx) => {
      await new Promise((resolve) => setTimeout(resolve, 10 * idx))
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((res) => {
        if (res.status === 200) {
          return res.json()
        } else {
          throw new Error(`Hacker News API returned ${res.status}`)
        }
      })
      return {
        id: response.id,
        title: response.title,
        originLink: response.url ?? `https://news.ycombinator.com/item?id=${response.id}`,
        originBody: response.text,
        commentLink: `https://news.ycombinator.com/item?id=${response.id}`,
        commentBody: '',
        originSummary: [],
        commentSummary: [],
        points: response.score,
        commentCount: response.descendants,
        retryCount: 0,
        time: response.time,
      } as Story
    })
  )
  bestStories = bestStories.filter((story) => {
    const now = new Date()
    const storyDate = new Date(story.time * 1000)
    const diff = now.getTime() - storyDate.getTime()
    const diffHours = diff / (1000 * 3600)
    return diffHours < 24
  })
  bestStories.sort((a, b) => b.points - a.points)
  bestStories = bestStories.slice(0, HACKER_NEWS_COUNT_PER_WORKER)
  return bestStories
}

export const updateNews = async (obj: {
  query: string
}): Promise<Story[]> => {
  const { query } = obj

  const USERNAME = process.env.SERP_USERNAME
  const PASSWORD = process.env.SERP_PASSWORD
  const HOST = process.env.SERP_HOST

  try {
    const options = {
      url: `https://www.google.com/search?q=${query}&tbm=nws&brd_json=1`,
      proxy:
        `http://${USERNAME}:${PASSWORD}@${HOST}`,
      rejectUnauthorized: false,
      json: true,
    }
    const data = await rp(options)
    return data?.news.map((story: any) => {
      return {
        title: story.title,
        originLink: story.link,
        originBody: "",
        originSummary: [],
        commentBody: "N/A",
        commentSummary: ['N/A'],
        downloadMethod: "",
        retryCount: 0,
        time: Date.now(),
      }
    })
  } catch (err) {
    console.error('Error updating stories:', err)
    throw err
  }
}
