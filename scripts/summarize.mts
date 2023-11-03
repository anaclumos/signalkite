import { loadSummarizationChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAI } from 'langchain/llms/openai'
import { HumanMessage, SystemMessage } from 'langchain/schema'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import { log, sanitize } from './util.mjs'
import { Story } from './type.mjs'

export const createBulletPointSummary = async (title, context, lang = 'en') => {
  // for generating the actual chat
  const chat = new ChatOpenAI({ modelName: 'gpt-4' })
  try {
    log(`🍵 Distilling\t${title}`, 'info')

    const response = await chat.call([
      new SystemMessage(
        `
        You are a professional, fair, and intelligent expert journalist for cutting-edge tech news.
        You must provide a concise summary in mutually exclusive but collectively complete bullet points.
        Some comments may include sarcasm, and you must figure out that it's not the central argument or factual.
        Remain neutral and objective.
        Write the summary as if you are explaining to a university student or an entry-level software engineer.
        The primary readers of this post are new to the industry and would want some background context.
        You must consider this question:
        - What is the most important thing people should know about this post?
        - Why is this post special? Is there something new or exciting thing going on?
        - Did something get released? What made such tech-savvy people suddenly interested in this post?
        Your job is to capture vital points that interest the readers.


        It must be a bullet point list, not a freeform text; that is, start with '-' immediately followed by a space.
        Therefore, it will start with '- '.
        Each bullet should terminate with one return '\n'.
        Do not change line twice between bullets.
        It must be grammatically correct and polite.
        The sentence should not be insensitive or offensive.
        Explain all jargons and acronyms.
        Employ transitioning phrases and native arguments, but concise and succinct.
        If you get a message that it requires a security access check, or the website is unreachable, simply print "N/A."

        For example:

        TEXT:
        "Major publishing companies are bombarding volunteers who operate IPFS gateways with tens of thousands of DMCA notices, despite knowing that these volunteers are not responsible for the content and cannot take it down. One gateway operator has already shut down their service due to the pressure. The notices are being sent to abuse addresses at the host of the gateways, rather than directly to the volunteers. The notices demand the takedown of thousands of URLs that have nothing to do with the volunteers and are often not even accessible. This demonstrates that IPFS, although technically resilient against censorship, can still be affected by self-censorship due to the pressure from copyright complaints."

        RESULT:
        
        '- Major publishers are inundating volunteers running IPFS gateways with a flood of DMCA notices, despite knowing these volunteers cannot control or remove the content.\n'
        '- One gateway operator has ceased their service due to this pressure, showing that while IPFS is robust against censorship, it's susceptible to self-censorship from copyright complaints.\n'
        '- The DMCA notices, demanding the removal of thousands of unrelated URLs, are being directed to the hosts of the gateways, not the volunteers themselves.\n'

        Now, I will give you the text.
        If there is no meaningful content, for example, if it looks like a simple error message, simply print "N/A."
        Ignore any mention or sentenses on CSS contents and any referral, marketing, or promotional links/coupon codes.
        Do not exceed 100 words. Do not exceed more than 3 bullet points.

        YOU MUST SUMMARIZE IN LANGUAGE: ${lang.toUpperCase()}.
        `
      ),
      new HumanMessage(`TEXT:\n${context}\n\nRESULT:\n`),
    ])

    const { content } = response
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
  // for generating the actual chat
  const chat = new ChatOpenAI({ modelName: 'gpt-4' })
  try {
    log(`🍵 Distilling\t${title}`, 'info')

    const response = await chat.call([
      new SystemMessage(
        `
        You are a professional, fair, and intelligent expert journalist for cutting-edge tech news.
        You must provide a concise title of the article, that captures the essence of the article.
        The original title was "${title}", which may or may not be click-baity, cut off, or lack of context.
        YOU MUST SUMMARIZE IN LANGUAGE: ${lang.toUpperCase()}.
        Now, I will give you the text.
        `
      ),
      new HumanMessage(`TEXT:\n${context}\n\nRESULT:\n`),
    ])

    const { content } = response
    return sanitize(content)
  } catch (e) {
    log(e, 'error')
    return ''
  }
}

export const generateContext = async (rawText, title, lang = 'en') => {
  const model = new OpenAI({ modelName: 'gpt-4' })

  const chain = loadSummarizationChain(model, { type: 'map_reduce' })
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 6144,
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

  const context = await generateContext(story.originBody, story.title, lang)

  try {
    if (story.originBody.length === 0) {
      throw new Error('🚨\toriginBody is empty')
    }
    originSummary = await createBulletPointSummary(story.title, context, lang)
  } catch (e) {
    log(e, 'error')
  }
  try {
    commentSummary = await createBulletPointSummary(story.title, context, lang)
  } catch (e) {
    log(e, 'error')
  }
  try {
    title = await createTitle(story.title, context, lang)
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
