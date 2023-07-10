// To access your database
// Append api/* to import from api and web/* to import from web
import { db } from 'api/src/lib/db'
import { loadSummarizationChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { OpenAI } from 'langchain/llms/openai'
import { HumanChatMessage, SystemChatMessage } from 'langchain/schema'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import { log, sanitize, throttle } from './util'

const createBulletPointSummary = async (rawText, title) => {
  // for summarizing and context generating
  const model = new OpenAI({ modelName: 'gpt-3.5-turbo-16k' })
  // for generating the actual chat
  const chat = new ChatOpenAI({ modelName: 'gpt-3.5-turbo' })

  const chain = loadSummarizationChain(model, { type: 'map_reduce' })
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 8192,
    })

    log(`⏳ Shortening "${title}"`, 'info')
    const bodyDoc = await textSplitter.createDocuments([sanitize(rawText)])
    const bodyRes = await chain.call({
      input_documents: bodyDoc,
    })
    if (!bodyRes?.text) return

    const summary = sanitize(bodyRes.text)

    log(`⏳ Generating Summary for "${title}"`, 'info')

    const response = await chat.call([
      new SystemChatMessage(
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
        If there is no meaningful content, for example, if it looks like a simple error message, simply print "N/A."
        Ignore any mention or sentenses on CSS contents and any referral, marketing, or promotional links/coupon codes.

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
        `
      ),
      new HumanChatMessage(`TEXT:\n${summary}\n\nRESULT:\n`),
    ])

    const { text } = response
    let arr = text.split('\n')

    arr = arr.map((item) => sanitize(item))
    arr = arr.map((item) => {
      if (item.startsWith('- ')) {
        item = item.substring(2)
      }
      if (item.endsWith("' -")) {
        item = item.substring(0, item.length - 3)
      }
      if (item.endsWith("'")) {
        item = item.substring(0, item.length - 1)
      }

      return sanitize(item)
    })
    return arr
  } catch (e) {
    console.error(e)
  }
}

const main = async () => {
  const linkSummaries = await db.linkSummary.findMany({
    where: {
      AND: [
        {
          OR: [
            { linkSummary: null },
            { linkSummary: '' },
            { commentSummary: null },
            { commentSummary: '' },
          ],
        },
        {
          AND: [
            { body: { not: '' } },
            { body: { not: null } },
            { commentBody: { not: '' } },
            { commentBody: { not: null } },
            { title: { not: '' } },
          ],
        },
      ],
    },
    take: 20,
  })

  await Promise.all(
    linkSummaries.map(async (link) => {
      throttle()
      const linkSummary = await createBulletPointSummary(link.body, link.title)
      log(`✅ Summary for ${link.title} created`)
      throttle()
      const commentSummary = await createBulletPointSummary(
        link.commentBody,
        link.title
      )
      log(`✅ Comment summary for ${link.title} created`)

      await db.linkSummary.update({
        where: { id: link.id },
        data: {
          linkSummary: JSON.stringify(linkSummary),
          commentSummary: JSON.stringify(commentSummary),
        },
      })
    })
  )
}

export default async () => {
  main()
    .then(async () => {
      await db.$disconnect()
      process.exit(0)
    })
    .catch(async (e) => {
      console.error(e)
      await db.$disconnect()
      process.exit(1)
    })
}
