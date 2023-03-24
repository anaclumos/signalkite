import openai
import dotenv
import os

dotenv.load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")


def shorten(text: str, limit: int) -> str:
    while len(text) > limit:
        words = text.split()
        words_2048 = [" ".join(words[i : i + limit]) for i in range(0, len(words), limit)]
        summary = ""
        print("Summarizing in 2048 word chunks.")
        for idx, w in enumerate(words_2048):
            print("Summarizing " + str(idx + 1) + "/" + str(len(words_2048)))
            try:
                completion = openai.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {
                            "role": "user",
                            "content": f"Summarize in less than {limit // 8} words. Capture key points. Do not waste timespace. Text: {w}",
                        }
                    ],
                )
            except Exception as e:
                print(f"Cannot summarize, error: {e}")
                continue
            summary += completion["choices"][0]["message"]["content"]
        text = summary
    return text


def bulletpoint_summarize(title, text):
    try:
        print(f"Woring on: {title}")
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": f"You are HackerNewsGPT, a Summarization Bot for Hacker News. I will give you the text content. Your job is to give a concise summary in mutually exclusive but collectively exhaustive bullet points. The title of this post is '{title}'. Summarize in markdown bullets. Do not waste timespace. Text: {text}",
                },
            ],
        )
    except Exception as e:
        print(f"Cannot summarize: {title}, error: {e}")
    summary = completion["choices"][0]["message"]["content"].strip()
    return summary


def get_title(title, text):
    try:
        print(f"Woring on: {title}")
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": f"You are HackerNewsGPT, a Summarization Bot for Hacker News. I will give you the text content. Your job is to give a concise title for the following post. Do not waste timespace. HARD LIMIT 10 WORDS. Text: {text}",
                },
            ],
        )
        title = completion["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(f"Cannot get title: {title}, error: {e}")
    if title[-1] == ".":
        title = title[:-1]
    return title
