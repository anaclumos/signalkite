from Story import Story, Stories
import requests
import multiprocessing
import os
from closedai import title_format
from dotenv import load_dotenv
from time import sleep

load_dotenv()

HN_BEST_STORIES = "https://hacker-news.firebaseio.com/v0/beststories.json"
HN_STORY = "https://hacker-news.firebaseio.com/v0/item/{id}.json"
YT_URL = "https://www.youtube.com/"
YT_SHORT_URL = "https://youtu.be/"
TWITTER_URL = "https://twitter.com/"
TWITTER_SHORT_URL = "https://t.co/"
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
OPENAI_TOKEN_THRESHOLD = 2048  # It's actually 4096, but we want to be safe
CONCURRENT = 2


def get_story(id: int, start: int, end: int) -> Story:
    global HN_STORY
    sleep(0.1)
    with requests.get(HN_STORY.format(id=id)) as submission:
        response = submission.json()
        story = Story(
            id=id,
            timestamp=int(response.get("time", 0)),
            title=response["title"],
            url=response.get("url", ""),
            hn_url=f"http://news.ycombinator.com/item?id={id}",
        )
        story.original_title = response["title"]
        story.hn_title = response["title"]
        if start <= story.timestamp <= end:
            print(f"+ {story.title}")
        else:
            print(f"- {story.title}")
    return story

def get_top_hn_comments(id: int) -> list[str]:
    global HN_STORY
    with requests.get(HN_STORY.format(id=id)) as submission:
        response = submission.json()
        comments = response.get("kids", [])
        answer = []
        print(f"Downloading {min(10, len(comments))} comments")
        if comments:
            for i in range(min(10, len(comments))):
                sleep(1)
                with requests.get(HN_STORY.format(id=comments[i])) as comment:
                    print(f"Downloading comment {i + 1}/{min(10, len(comments))}")
                    response = comment.json()
                    answer.append(response.get("text", ""))
        return answer



def get_best_stories(start: int, end: int) -> Stories:
    global HN_BEST_STORIES
    global HN_STORY
    submissions = None
    with requests.get(HN_BEST_STORIES) as r:
        submissions = r.json()

    pool = multiprocessing.Pool(CONCURRENT)
    stories = pool.starmap(get_story, [(id, start, end) for id in submissions])
    pool.close()
    pool.join()

    stories = Stories([story for story in stories if start <= story.timestamp <= end])
    return stories[:20] # Only return the first few stories... DeepL is so expensive


def download_story(story: Story) -> Story:
    import bs4

    sleep(1)
    url = story.url
    if not url.startswith(TWITTER_URL) or url.startswith(TWITTER_SHORT_URL) or url.startswith(YT_SHORT_URL) or url.startswith(YT_URL):
        try:
            r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
            story.content += bs4.BeautifulSoup(r.text, "html.parser").get_text()
        except Exception as e:
            print(f"Failed to download main content from {story.title}, error: {e}")
    story.content += str(get_top_hn_comments(story.id))
    story.content.replace("\n", "")
    return story


def download_stories(stories: Stories) -> Stories:
    pool = multiprocessing.Pool(CONCURRENT)
    stories = pool.map(download_story, stories)
    pool.close()
    pool.join()

    return stories


def summarize_story(story: Story) -> Story:
    from closedai import shorten, bulletpoint_summarize, get_title

    sleep(1)
    global OPENAI_TOKEN_THRESHOLD
    print(f"Summarizing '{story.title}' ({len(story.content.split())} tokens)")
    while len(story.content.split()) > OPENAI_TOKEN_THRESHOLD:
        print(f"Story '{story.title}' is too long, shortening {len(story.content.split())} tokens")
        story.content = shorten(story.content, OPENAI_TOKEN_THRESHOLD, title=story.title)
    story.title = get_title(story.title, story.content)
    story.summary = bulletpoint_summarize(story.title, story.content)
    return story


def summarize_stories(stories: Stories) -> Stories:
    new_stories = Stories()
    for idx, story in enumerate(stories):
        story = summarize_story(story)
        if story.summary:
            new_stories.append(story)
        print(f"Finished summarizing {idx + 1}/{len(stories)} stories")
    return new_stories
