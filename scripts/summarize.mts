import { log, sanitize } from './util.mjs'
import { Story } from './type.mjs'
import { CREATE_BULLETPOINT_SUMMARY, CREATE_TITLE, YOU_MUST_WRITE_IN } from './default.mjs'
import OpenAI from 'openai'

const openai = new OpenAI({
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
})



export const sleep = async (ms = 10000) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const createBulletPointSummary = async (title, context, lang = 'en') => {
  sleep(10000)

  try {
    log(`🍵 Distilling\t${title}`, 'info')

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: CREATE_BULLETPOINT_SUMMARY[lang] + '\n\n' + YOU_MUST_WRITE_IN[lang] },
        { role: 'user', content: `TEXT:\n${context}\n\nRESULT:\n` },
      ],
      model: 'gpt-4o',
      temperature: 0,
    })

    let { content } = completion.choices[0].message

    let arr = content.split('\n')

    arr = arr.map((item) => sanitize(item))
    arr = arr.map((item) => {
      if (item.startsWith('- ')) {
        item = item.substring(2)
      }
      if (item.startsWith("' -")) {
        item = item.substring(3)
      }
      if (item.startsWith("'- ")) {
        item = item.substring(3)
      }
      if (item.endsWith("'")) {
        item = item.substring(0, item.length - 1)
      }

      return sanitize(item)
    })
    arr = arr.filter((item) => item !== '')
    arr = arr.filter((item) => item !== 'N/A')
    arr = arr.filter((item) => item !== 'N/A.')
    return arr
  } catch (e) {
    log(e, 'error')
    return []
  }
}

export const createTitle = async (title, context, lang = 'en'): Promise<string> => {
  sleep(10000)

  try {
    const originalTitle = title

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: CREATE_TITLE[lang].replace('${title}', title) + '\n\n' + YOU_MUST_WRITE_IN[lang] },
        { role: 'user', content: `TEXT:\n${context}\n\nRESULT:\n` },
      ],
      model: 'gpt-4o',
      temperature: 0,
    })
    let { content } = completion.choices[0].message
    const newTitle = sanitize(content)
    log(`📰 ${originalTitle}\t${newTitle}`, 'info')
    return newTitle
  } catch (e) {
    log(e, 'error')
    return ''
  }
}
export const generateContext = async (rawText, title, lang = 'en') => {
  sleep(10000)

  try {
    log(`⏳ Shortening\t${title}`, 'info')

    // Split the rawText into smaller chunks
    const chunkSize = 2000
    const chunks = splitText(rawText, chunkSize)

    // Process each chunk using map-reduce
    const processedChunks = await Promise.all(
      chunks.map(async (chunk) => {
        const completion = await openai.chat.completions.create({
          messages: [
            { role: 'system', content: 'Shorten the following text.' + '\n\n' + YOU_MUST_WRITE_IN[lang] },
            { role: 'user', content: chunk },
          ],
          model: 'gpt-4',
          temperature: 0,
        })

        const { content } = completion.choices[0].message
        return sanitize(content)
      })
    )

    // Combine the processed chunks
    const combinedContent = processedChunks.join(' ')

    return combinedContent
  } catch (e) {
    log(e, 'error')
    return ''
  }
}

const splitText = (text, chunkSize) => {
  const chunks = []
  let startIndex = 0

  while (startIndex < text.length) {
    const chunk = text.slice(startIndex, startIndex + chunkSize)
    chunks.push(chunk)
    startIndex += chunkSize
  }

  return chunks
}

export const summarize = async (story: Story, lang = 'en'): Promise<Story> => {
  if ((story.originSummary.length ?? 0) !== 0) {
    log(`💘 Summ Exists\t${story.title}`, 'error')
    return story
  }

  let originSummary = []
  let commentSummary = []
  let title = ''

  const originContext = await generateContext(story.originBody, story.title, lang)
  const commentContext = await generateContext(story.commentBody, story.title, lang)

  try {
    if (story.originBody.length === 0) {
      throw new Error('🚨\toriginBody is empty')
    }
    originSummary = await createBulletPointSummary(story.title, originContext, lang)
  } catch (e) {
    log(e, 'error')
  }
  try {
    commentSummary = await createBulletPointSummary(story.title, commentContext, lang)
  } catch (e) {
    log(e, 'error')
  }
  try {
    title = await createTitle(story.title, originContext, lang)
  } catch (e) {
    log(e, 'error')
  }

  return {
    ...story,
    originSummary,
    commentSummary,
    title,
  }
}
