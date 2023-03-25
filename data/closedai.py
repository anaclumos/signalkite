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
            sleep(4)  # OpenAI has a rate limit of 20 requests per minute
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "user",
                        "content": f"Summarize. Hard limit {limit // 16} words. Capture Key Points. If there is an esoteric arcane word that aptly describes the sentence, utilize it to make the sentence shorter. Text: {w}",
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
        sleep(4)  # OpenAI has a rate limit of 20 requests per minute
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": f"You are HackerNewsGPT, a Summarization AI for Hacker News. I will give you the text content. Your job is to give a concise summary in mutually exclusive but collectively exhaustive bullet points. The title of this post is '{title}'. Summarize in markdown bullets '-'. Do not waste timespace. Text: {text}",
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
    return title


def get_title(title, text):
    try:
        print(f"Finding a better title... {title}")
        for _ in range(OPENAI_RETRY_COUNT):
            sleep(4)  # OpenAI has a rate limit of 20 requests per minute
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "user",
                        "content": f"You are HackerNewsGPT, a Summarization AI for Hacker News. I will give you the text content. Your job is to give a concise title for the following post. Capitalize Important Words: Adjectives (tiny, large, etc.), Adverbs (quietly, smoothly, etc.), Nouns (tablet, kitchen, book), Pronouns (they, she, he), Subordinating conjunctions (when fewer than 5 letters), Verbs (write, type, create). Do not caplitalize: Articles (a, an, the), Coordinating Conjunctions (and, but, for), Short (fewer than 4 letters), Prepositions (at, by, to, etc.). Do not waste timespace. Do not add suffixes, such as '| Website'. Ignore Website saying You Need JavaScript; That's not the important part. No period at the end. The original title was {title}. HARD LIMIT 10 WORDS. Text: {text}",
                    },
                ],
            )
            title = completion["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"Cannot get title: {title}, trying again with shorter text... error: {e}")
        new_text = text.split(".")
        new_text = ".".join(new_text[: 4 * len(new_text) // 5])
        return get_title(title, new_text)
    return title
