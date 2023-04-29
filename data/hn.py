from Story import Story, Stories
import requests
import os
from closedai import title_format
from dotenv import load_dotenv
from time import sleep
from selenium import webdriver
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.core.utils import ChromeType
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

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
POST_COUNT = 10
OPENAI_TOKEN_THRESHOLD = 5000  # It's actually 8K, but we want to be safe


chrome_options = Options()
options = [
    "--headless",
    "--disable-gpu",
    "--window-size=1920,1200",
    "--ignore-certificate-errors",
    "--disable-extensions",
    "--no-sandbox",
    "--disable-dev-shm-usage",
]
for option in options:
    chrome_options.add_argument(option)

driver = webdriver.Chrome(
    options=chrome_options,
)


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
            print(f"+ {story.title}" + " " * 100)
        else:
            print(f"- {story.title}" + " " * 100, end="\r")
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

    if len(stories) > POST_COUNT:
        return stories[:POST_COUNT]
    return stories


def download_story(story: Story) -> Story:
    url = story.url
    if not url.startswith(YT_SHORT_URL) and not url.startswith(YT_URL) and url != "":
        try:
            driver.get(url)
            article = driver.find_element(By.TAG_NAME, "article")
            print(f"Found article: {' '.join(article.text.split(' ')[0:10])}...")
            story.content += article.text
        except Exception as e:
            print(
                f"Failed to download main content from {story.title}. Retrying in 1 seconds..."
            )
            sleep(1)
            try:
                driver.get(url)
                article = driver.find_element(By.TAG_NAME, "body")
                print(f"Found body, using that instead.")
                story.content += article.text
            except Exception as e:
                story.content = "This page does not have main article."
                print(f"Failed to download main content from {story.title}, error: {e}")
    sleep(1)
    try:
        sleep(1)
        driver.get(story.hn_url)
        story.hn_content += driver.find_element(By.TAG_NAME, "body").text
    except Exception as e:
        print(
            f"Failed to download HN comments from {story.title}. Retrying in 1 seconds..."
        )
        sleep(1)
        try:
            driver.get(story.hn_url)
            story.hn_content += driver.find_element(By.TAG_NAME, "body").text
        except Exception as e:
            print(f"Failed to download HN comments from {story.title}, error: {e}")
    story.content = (
        story.content.replace("\n", "")
        .replace("\t", "")
        .replace("\r", "")
        .replace("  ", " ")
        .strip()
    )
    story.hn_content = (
        story.hn_content.replace("\n", "")
        .replace("\t", "")
        .replace("\r", "")
        .replace("  ", " ")
        .strip()
    )
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
    print(
        f"Summarizing '{story.title}' ({story.score} upvotes, {len(story.content.split())} tokens)"
    )
    while len(story.content.split()) > OPENAI_TOKEN_THRESHOLD:
        print(
            f"Story '{story.title}' is too long, shortening {len(story.content.split())} tokens"
        )
        story.content = shorten(
            story.content, OPENAI_TOKEN_THRESHOLD, title=story.title
        )
    while len(story.hn_content.split()) > OPENAI_TOKEN_THRESHOLD:
        print(
            f"HN comments for '{story.title}' are too long, shortening {len(story.hn_content.split())} tokens"
        )
        story.hn_content = shorten(
            story.hn_content, OPENAI_TOKEN_THRESHOLD, title=story.title
        )
    story.title = title_format(story.title)
    story.summary = bulletpoint_summarize(story.title, story.content)
    story.hn_summary = summarize_hn_comments(
        story.title, story.hn_content, story.summary
    )
    return story


def summarize_stories(stories: Stories) -> Stories:
    new_stories = Stories()

    for idx, story in enumerate(stories):
        print(
            f"{idx + 1}/{len(stories)}: {story.title}, {story.score} upvotes, {len(story.content.split())} tokens"
        )

    for idx, story in enumerate(stories):
        story = summarize_story(story)
        if story.summary:
            new_stories.append(story)
        print(f"Finished summarizing {idx + 1}/{len(stories)} stories")
    return new_stories
