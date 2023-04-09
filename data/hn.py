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
GITHUB_URL = "https://github.com/"
GITLAB_URL = "https://gitlab.com/"
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
OPENAI_TOKEN_THRESHOLD = 1536  # It's actually 4096, but we want to be safe


def get_story(id: int, start: int, end: int) -> Story:
    global HN_STORY
    sleep(0.1)
    with requests.get(HN_STORY.format(id=id)) as submission:
        response = submission.json()
        story = Story()
        story.id = id
        story.timestamp = int(response.get("time", 0))
        story.title = response["title"]
        story.url = response.get("url", "")
        story.hn_url = f"http://news.ycombinator.com/item?id={id}"
        story.original_title = response["title"]
        story.hn_title = response["title"]
        story.score = response.get("score", 0)
        if start <= story.timestamp <= end:
            print(f"+ {story.title}" + " " * 50)
        else:
            print(f"- {story.title}" + " " * 50, end="\r")
        return story


def get_best_stories(start: int, end: int) -> Stories:
    global HN_BEST_STORIES
    global HN_STORY
    submissions = None
    with requests.get(HN_BEST_STORIES) as r:
        submissions = r.json()

    stories = []
    for submission in submissions:
        stories.append(get_story(submission, start, end))

    stories = Stories([story for story in stories if start <= story.timestamp <= end])
    stories.sort(key=lambda x: x.score, reverse=True)

    if len(stories) > 30:
        return stories[:30]
    return stories


def download_story(story: Story) -> Story:
    import bs4

    sleep(1)
    url = story.url

    if url.startswith(GITHUB_URL):
        username = url.split("/")[3]
        repo = url.split("/")[4]
        url = f"https://raw.githubusercontent.com/{username}/{repo}/master/README.md"

    if url.startswith(GITLAB_URL):
        username = url.split("/")[3]
        repo = url.split("/")[4]
        url = f"https://gitlab.com/{username}/{repo}/-/raw/master/README.md"
    if (
        not url.startswith(TWITTER_URL)
        or url.startswith(TWITTER_SHORT_URL)
        or url.startswith(YT_SHORT_URL)
        or url.startswith(YT_URL)
    ) and url != "":
        try:
            r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
            story.content += bs4.BeautifulSoup(r.text, "html.parser").get_text()
        except Exception as e:
            print(f"Failed to download main content from {story.title}, error: {e}. Retrying in 1 seconds...")
            sleep(1)
            try:
                r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
                story.content += bs4.BeautifulSoup(r.text, "html.parser").get_text()
            except Exception as e:
                print(f"Failed to download main content from {story.title}, error: {e}")
    sleep(1)
    try:
        r = requests.get(story.hn_url, headers={"User-Agent": "Mozilla/5.0"})
        story.hn_content += bs4.BeautifulSoup(r.text, "html.parser").get_text()
    except Exception as e:
        print(f"Failed to download HN comments from {story.title}, error: {e}. Retrying in 1 seconds...")
        sleep(1)
        try:
            r = requests.get(story.hn_url, headers={"User-Agent": "Mozilla/5.0"})
            story.hn_content += bs4.BeautifulSoup(r.text, "html.parser").get_text()
        except Exception as e:
            print(f"Failed to download HN comments from {story.title}, error: {e}")
    story.content = story.content.replace("\n", "").replace("\t", "").replace("\r", "").replace("  ", " ").strip()
    story.hn_content = story.hn_content.replace("\n", "").replace("\t", "").replace("\r", "").replace("  ", " ").strip()
    print(
        f"Downloaded '{story.title}' ({story.score} upvotes, {len(story.content.split()) + len(story.hn_content.split())} tokens)"
    )
    return story


def download_stories(stories: Stories) -> Stories:
    for story in stories:
        download_story(story)

    return stories


def summarize_story(story: Story) -> Story:
    from closedai import shorten, bulletpoint_summarize, summarize_hn_comments

    sleep(1)
    global OPENAI_TOKEN_THRESHOLD
    print(f"Summarizing '{story.title}' ({story.score} upvotes, {len(story.content.split())} tokens)")
    while len(story.content.split()) > OPENAI_TOKEN_THRESHOLD:
        print(f"Story '{story.title}' is too long, shortening {len(story.content.split())} tokens")
        story.content = shorten(story.content, OPENAI_TOKEN_THRESHOLD, title=story.title)
    while len(story.hn_content.split()) > OPENAI_TOKEN_THRESHOLD:
        print(f"HN comments for '{story.title}' are too long, shortening {len(story.hn_content.split())} tokens")
        story.hn_content = shorten(story.hn_content, OPENAI_TOKEN_THRESHOLD, title=story.title)
    story.title = title_format(story.title)
    story.summary = bulletpoint_summarize(story.title, story.content)
    story.hn_summary = summarize_hn_comments(story.title, story.hn_content, story.summary)
    return story


def summarize_stories(stories: Stories) -> Stories:
    new_stories = Stories()

    for idx, story in enumerate(stories):
        print(f"{idx + 1}/{len(stories)}: {story.title}, {story.score} upvotes, {len(story.content.split())} tokens")

    for idx, story in enumerate(stories):
        story = summarize_story(story)
        if story.summary:
            new_stories.append(story)
        print(f"Finished summarizing {idx + 1}/{len(stories)} stories")
    return new_stories
