import { loadSummarizationChain } from 'langchain/chains'
import { ChatOpenAI } from '@langchain/openai'
import { OpenAI } from '@langchain/openai'
import { HumanMessage, SystemMessage } from '@langchain/core/messages'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import { log, sanitize } from './util.mjs'
import { Story } from './type.mjs'
import { CREATE_BULLETPOINT_SUMMARY, CREATE_TITLE, YOU_MUST_WRITE_IN } from './default.mjs'

export const sleep = async (ms = 10000) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const createBulletPointSummary = async (title, context, lang = 'en') => {
  sleep(10000)
  let chat = new ChatOpenAI({ modelName: 'gpt-4' })

  if (lang === 'en') {
    chat = new ChatOpenAI({ modelName: 'gpt-3.5-turbo' })
  }

  try {
    log(`🍵 Distilling\t${title}`, 'info')
    const response = await chat.call([
      new SystemMessage(CREATE_BULLETPOINT_SUMMARY[lang] + YOU_MUST_WRITE_IN[lang]),
      new HumanMessage(`TEXT:\n${context}\n\nRESULT:\n`),
    ])

    const { content } = response

    if (typeof content !== 'string') {
      log(`🚨\t${title}\t${content}`, 'error')
      return []
    }

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
  let chat = new ChatOpenAI({ modelName: 'gpt-4' })

  if (lang === 'en') {
    chat = new ChatOpenAI({ modelName: 'gpt-3.5-turbo' })
  }
  try {
    const originalTitle = title
    const response = await chat.call([
      new SystemMessage(CREATE_TITLE[lang].replace('${title}', title) + YOU_MUST_WRITE_IN[lang]),
      new HumanMessage(`TEXT:\n${context}\n\nRESULT:\n`),
    ])

    const { content } = response
    if (typeof content !== 'string') {
      log(`🚨\t${title}\t${content}`, 'error')
      return ''
    }
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

  let model = new OpenAI({ modelName: 'gpt-4' })
  if (lang === 'en') {
    model = new OpenAI({ modelName: 'gpt-3.5-turbo' })
  }
  const chain = loadSummarizationChain(model, { type: 'map_reduce' })
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 3000,
    })

    log(`⏳ Shortening\t${title}`, 'info')
    const bodyDoc = await textSplitter.createDocuments([sanitize(rawText)])
    const bodyRes = await chain.call({
      input_documents: bodyDoc,
    })
    if (!bodyRes?.text) return

    const summary = sanitize(bodyRes.text)
    return summary
  } catch (e) {
    log(e, 'error')
    return ''
  }
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
