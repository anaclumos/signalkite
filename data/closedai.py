import openai
from dotenv import load_dotenv
from time import sleep
import os

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
OPENAI_RETRY_COUNT = 5

SITUATION = """
You are an editor at 'The Tech Times', an expert journalist for cutting-edge tech News.
I will give you the raw text content.
You must provide a concise summary in mutually exclusive but collectively complete bullet points.
Please understand that some comments may include sarcasm, and you must figure out that it's not the central argument or factual.
Remain neutral and objective.

Write the summary as if you are explaining to a university student or an entry-level software engineer.
The primary readers of this post are new to the industry and would want some background context.
You must consider this question: What is the most important thing people should know about this post? Why is this post special? Is there something new or exciting thing going on? Did something get released?
What made such tech-savvy people suddenly interested in this post? Your job is to capture vital points that interest the readers.

If there is no meaningful content, for example, if it looks like a simple error message, leave it blank.
"""


def shorten(text: str, limit: int, title="") -> str:
    summary = ""
    error_occurred = False
    try:
        words = text.split()
        chunks = [" ".join(words[i : i + limit]) for i in range(0, len(words), limit)]
        for idx, w in enumerate(chunks):
            print(
                "Summarizing ("
                + str(idx + 1)
                + "/"
                + str(len(chunks))
                + f") {title}..."
            )
            sleep(1)
            completion = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "user",
                        "content": f"""
{SITUATION}
                        
Hard limit {limit // 16} words.
Please understand that some comments may include sarcasm, and you must realize it's not the main point.
Text: {w}
""",
                    }
                ],
            )
            summary += completion["choices"][0]["message"]["content"]
        text = summary
    except Exception as e:
        print(f"Cannot summarize, error: {e}")
        error_occurred = True
    if error_occurred:
        new_text = text.split(".")
        new_text = ".".join(new_text[: 4 * len(new_text) // 5])  # 80% of the text
        return shorten(new_text, limit, title)
    print(f"Shortened {title} to {len(text.split())} tokens")
    return text


def bulletpoint_summarize(title, text):
    summary = ""
    error_occurred = False
    try:
        print(f"Creating Summary for... {title}")
        sleep(1)
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": f"""
{SITUATION}
                    
Use markdown syntax wherever possible, such as making quotes, bold texting, or in-line codes.
It must be a bullet point list, not a freeform text; that is, start with '-' immediately followed by a space.
It must be grammatically correct and polite.
The title of this post is '{title}'.

You must write the summary as if you are explaining to an university student or an entry-level software engineer.
That is, you can assume that people will know some basic technical knowledge, but you have to give more detail on the surrounding topics.
Be sure to write the article in a well-written, natural, fluent way, so that an average software engineer will have no problem understanding the text.
Employ transitioning phrases and native arguments, but concise and succinct.

Now, I will give you the text.

Do not exceed 3 bullet points. Keep the most important 3 key points, and ignore the rest.

Text: {text}
""",
                },
            ],
        )
        summary = completion["choices"][0]["message"]["content"].strip()
    except Exception as e:
        print(
            f"Cannot summarize: {title}, trying again with shorter text... error: {e}"
        )
        error_occurred = True
    if error_occurred:
        new_text = text.split(".")
        new_text = ".".join(new_text[: 4 * len(new_text) // 5])
        return bulletpoint_summarize(title, new_text)
    return summary


def summarize_hn_comments(title, text, summary):
    summary = ""
    error_occurred = False
    try:
        print(f"Summarizing HN Comments... {title}")
        sleep(1)
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "user",
                    "content": f"""
{SITUATION}

Use markdown syntax wherever possible, such as making quotes, bold texting, or in-line codes.
It must be bullet points.
It must be grammatically correct and polite.
Each sentence must end with punctuation, such as a period.
The title of this post is '{title}'.

These are the HN Comments. The comments may digress from the main point.
You must ignore the digression, and focus on the main points of the article, unless the digression is relevant to the article or article is unaccessible.
Ignore Y Combinator recruiting for cohorts; that's the footer of the website.

You must summarize the text, but do not repeat the article content itself. These are already covered somewhere else,
and you must extract that how people are criticizing or making new point of views based on this shared knowledge.

Avoid discussion on politics, religion, or other controversial topics.

Now, given the previous text, summarize the following hacker news comments in markdown bullets.
It must be a bullet point list, not a freeform text; that is, start with '-' immediately followed by a space.

Do not exceed 3 bullet points. Keep the most important 3 key points, and ignore the rest.

Text: {text}
""",
                },
            ],
        )
        summary = completion["choices"][0]["message"]["content"].strip()
    except Exception as e:
        error_occurred = True
    if error_occurred:
        sleep(1)
        print(
            f"Cannot summarize: {title}, trying again with shorter text... error: {e}"
        )
        new_text = text.split(".")
        new_text = ".".join(new_text[: 4 * len(new_text) // 5])
        return summarize_hn_comments(title, new_text)
    try:
        summary = "\n".join(summary.split("\n")[1:])
    except:
        pass
    return summary


def title_format(title):
    title = title.strip()
    title = title.replace("’", "'")
    title = title.replace("“", '"')
    title = title.replace("”", '"')
    title = title.replace("‘", "'")
    title = title.replace(" and ", " & ")
    title = title.replace(" And ", " & ")
    title = title.replace(" AND ", " & ")
    if title[-1] == ".":
        title = title[:-1]
    if title[0] == '"' and title[-1] == '"':
        title = title[1:-1]
    if title[0] == "'" and title[-1] == "'":
        title = title[1:-1]
    return title
