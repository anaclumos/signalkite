import openai
from dotenv import load_dotenv
from time import sleep
import os

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
OPENAI_RETRY_COUNT = 5


def shorten(text: str, limit: int, title="") -> str:
    summary = ""
    try:
        words = text.split()
        chunks = [" ".join(words[i : i + limit]) for i in range(0, len(words), limit)]
        for idx, w in enumerate(chunks):
            print("Summarizing (" + str(idx + 1) + "/" + str(len(chunks)) + f") {title}...")
            sleep(1)  # OpenAI has a rate limit of 60 requests per minute for pay-as-you-go users
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "user",
                        "content": f"""

                        
You are an editor at 'The Tech Times', a Expert Journalist for Cutting-Edge Tech News.
You were writing an article, but found that the article is too long, so you decided to summarize it.
I will give you the raw text content. Your job is to give a concise summary in mutually exclusive but collectively exhaustive sentences.

You must understand that the primary readers of this post are experts in the field, and they do not what to read the same thing that they already know.
You must keep this question in mind: What is the most important thing people should know about this post? Why is this post special?
Is there something new or interesting thing going on?
Why is this post, out of all the posts on Hacker News, suddenly getting so much attention?
What made such tech-savvy people suddenly interested in this post?

Hard limit {limit // 16} words.
Please understand that some comments may include sarcasm, and you must understand it's not the main point. 
If there is an esoteric arcane word that aptly describes the sentence, utilize it to make the sentence shorter.

Text: {w}
""",
                    }
                ],
            )
            summary += completion["choices"][0]["message"]["content"]
        text = summary
    except Exception as e:
        print(f"Cannot summarize, error: {e}")
        new_text = text.split(".")
        new_text = ".".join(new_text[: 4 * len(new_text) // 5])  # 80% of the text
        return shorten(new_text, limit, title)
    print(f"Shortened {title} to {len(text.split())} tokens")
    return text


def bulletpoint_summarize(title, text):
    summary = ""
    try:
        print(f"Creating Summary for...   {title}")
        sleep(1)  # OpenAI has a rate limit of 60 requests per minute for pay-as-you-go users
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": f"""

You are an editor at 'The Tech Times', a Expert Journalist for Cutting-Edge Tech News.
I will give you the raw text content. Your job is to give a concise summary in mutually exclusive but collectively exhaustive sentences.
Please understand that some comments may include sarcasm, and you must figure out that it's not the main argument or factual.

You must understand that the primary readers of this post are experts in the field, and they do not what to read the same thing that they already know.
You must keep this question in mind: What is the most important thing people should know about this post? Why is this post special?
Is there something new or interesting thing going on?
Why is this post, out of all the posts on Hacker News, suddenly getting so much attention?
What made such tech-savvy people suddenly interested in this post?

Your job is to capture such key points, that would make the readers interested.
Do not repeat dull facts, such as 'The post is about a new technology'.

You must also be aware that you should be 'confident but not arrogant'.
You must not use expressions like "this may be..." "potentially"... or such.
Things should be 'clearly' and 'obviously' stated.

Use markdown syntax wherever possible, such as making quotes or bold texting, or in-line codes.
It must be a freeform text, not bullet points. It must be grammatically correct and polite.
Each sentence must end with a punctuation, such as a period. The title of this post is '{title}'.

Now, I will give you the text.
Summarize in markdown, less than 100 tokens.
Text: {text}""",

                },
            ],
        )
        summary = completion["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"Cannot summarize: {title}, trying again with shorter text... error: {e}")
        new_text = text.split(".")
        new_text = ".".join(new_text[: 4 * len(new_text) // 5])
        return bulletpoint_summarize(title, new_text)
    return summary


def title_format(title):
    title = title.strip()
    if title[-1] == ".":
        title = title[:-1]
    if title[0] == '"' and title[-1] == '"':
        title = title[1:-1]
    if title[0] == "'" and title[-1] == "'":
        title = title[1:-1]
    title = title.replace("’", "'")
    title = title.replace("“", '"')
    title = title.replace("”", '"')
    title = title.replace("‘", "'")
    title = title.replace(" and ", " & ")
    title = title.replace(" And ", " & ")
    title = title.replace(" AND ", " & ")
    return title


def get_title(title, text):
    try:
        print(f"Finding a better title... {title}")
        for _ in range(OPENAI_RETRY_COUNT):
            sleep(1)  # OpenAI has a rate limit of 60 requests per minute for pay-as-you-go users
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "user",
                        "content": f"""
You are an editor at 'The Tech Times', a Expert Journalist for Cutting-Edge Tech News.
I will give you the raw text content. Your job is to give a concise title for the following post.

You must understand that the primary readers of this post are experts in the field, and they do not what to read the same thing that they already know.
You must keep this question in mind: What is the most important thing people should know about this post? Why is this post special?
Is there something new or interesting thing going on?
Why is this post, out of all the posts on Hacker News, suddenly getting so much attention?
What made such tech-savvy people suddenly interested in this post?

Your job is to capture such key points, that would make the readers interested.
Do not repeat dull facts, such as 'The post is about a new technology'.

Capitalize in Chicago style.
you must keep the proper nouns, acronyms, scientific terms, and registered trademarks as is,
such as 'iCloud', 'macOS', 'GPT', 'US', 'FBI', 'EU', 'CFTC', 'LLMs', 'GPTs', 'HN', 'Q&A', 'OpenPGP', 'SSH', 'PDF', 'PH.D.', '$3M', and so on.

Do not add suffixes, such as '| Website'.

Ignore Website saying You Need JavaScript; That's not the important part.
No period at the end.

Please understand that some comments may include sarcasm, and you must understand it's not the main point.
The original title was {title}. HARD LIMIT 10 WORDS. Text: {text}

What would be a better title for this post?
""",
                    },
                ],
            )
            title = completion["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"Cannot get title: {title}, trying again with shorter text... error: {e}")
        new_text = text.split(".")
        new_text = ".".join(new_text[: 4 * len(new_text) // 5])
        return get_title(title, new_text)
    return title_format(title)
