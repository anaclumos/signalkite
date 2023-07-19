// To access your database
// Append api/* to import from api and web/* to import from web
import { db } from 'api/src/lib/db'
import { loadSummarizationChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAI } from 'langchain/llms/openai'
import { HumanMessage, SystemMessage } from 'langchain/schema'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import { GPT_RETRY_LIMIT } from './config'
import { log, sanitize } from './util'

export const createBulletPointSummary = async (rawText, title) => {
  // for summarizing and context generating
  const model = new OpenAI({ modelName: 'gpt-3.5-turbo-16k' })
  // for generating the actual chat
  const chat = new ChatOpenAI({ modelName: 'gpt-3.5-turbo' })

  const chain = loadSummarizationChain(model, { type: 'map_reduce' })
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 8192,
    })

    log(`⏳ Shortening\t${title}`, 'info')
    const bodyDoc = await textSplitter.createDocuments([sanitize(rawText)])
    const bodyRes = await chain.call({
      input_documents: bodyDoc,
    })
    if (!bodyRes?.text) return

    const summary = sanitize(bodyRes.text)

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
        '- Major publishing companies are sending a large number of DMCA notices to volunteers who run IPFS gateways.\n'
        '- These volunteers are not responsible for the content and cannot remove it, but they are being targeted anyway.\n'
        '- One gateway operator has already stopped their service because of this pressure.\n'
        '- Despite its technical resilience against censorship, the IPFS network can still be affected by chilling effects and censorship through DMCA notices.\n'
        '- Evidence suggests that some of the URLs targeted in the notices have never been accessed or even worked.\n',

        Now, I will give you the text.
        If there is no meaningful content, for example, if it looks like a simple error message, simply print "N/A."
        Ignore any mention or sentenses on CSS contents and any referral, marketing, or promotional links/coupon codes.
        Do not exceed 100 words.
        `
      ),
      new HumanMessage(`TEXT:\n${summary}\n\nRESULT:\n`),
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
    console.error(e)
  }
}

/**
 *
 * Summarize the origin and comment body and store it in the database.
 * If the summary already exists, it will be updated.
 * Not functional programming. Updates the database.
 *
 * @param { string } title
 * @param { string } originBody
 * @param { string } commentBody
 * @param { string } originLink
 * @param { string } summaryLocale
 */
export const summarize = async ({
  title,
  originBody,
  commentBody,
  originLink,
  summaryLocale,
}: {
  title: string
  originBody: string
  commentBody: string
  originLink: string
  summaryLocale: string
}) => {
  const originSummaryArray = await createBulletPointSummary(originBody, title)
  const commentSummaryArray = await createBulletPointSummary(commentBody, title)

  return await db.summary.upsert({
    where: {
      originLink_summaryLocale: {
        originLink,
        summaryLocale,
      },
    },
    create: {
      title,
      originLink,
      summaryLocale,
      originBody,
      commentBody,
      summaryOrigin: JSON.stringify(originSummaryArray),
      summaryComment: JSON.stringify(commentSummaryArray),
    },
    update: {
      originBody,
      commentBody,
      summaryOrigin: JSON.stringify(originSummaryArray),
      summaryComment: JSON.stringify(commentSummaryArray),
    },
  })
}

/**
 * Assume that all required information already exists in the database.
 * Summarize the origin and comment body and store it in the database.
 *
 * @param { string } originLink
 * @param { string } summaryLocale
 * @returns
 */
export const summarizeWithAssumption = async ({
  originLink,
  summaryLocale,
}: {
  originLink: string
  summaryLocale: string
}) => {
  const origin = await db.summary.findUnique({
    where: {
      originLink_summaryLocale: {
        originLink,
        summaryLocale,
      },
    },
  })

  if (!origin) {
    log(`❌ Origin not found for ${originLink}`, 'error')
    return
  }

  if (origin.retryCount > GPT_RETRY_LIMIT) {
    log(`❌ Retry count exceeded for ${originLink}`, 'error')
    return
  }

  const title = origin.title
  const originBody = origin.originBody
  const commentBody = origin.commentBody

  if (origin.summaryOrigin) {
    log(`✅ Summary Exists\t${originLink}`)
    return origin
  }

  try {
    log(`🔍 Summarizing\t${originLink}...`, 'info')
    return await summarize({
      title,
      originBody,
      commentBody,
      originLink,
      summaryLocale,
    })
  } catch (e) {
    log(`❌ Failed to summarize ${originLink}`, 'error')
    return await db.summary.update({
      where: {
        originLink_summaryLocale: {
          originLink,
          summaryLocale,
        },
      },
      data: {
        retryCount: origin.retryCount + 1,
      },
    })
  }
}
