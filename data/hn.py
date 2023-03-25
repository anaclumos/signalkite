from Story import Story, Stories
import requests
import multiprocessing
import os
from dotenv import load_dotenv

load_dotenv()

HN_BEST_STORIES = "https://hacker-news.firebaseio.com/v0/beststories.json"
HN_STORY = "https://hacker-news.firebaseio.com/v0/item/{id}.json"
YT_URL = "https://www.youtube.com/"
YT_SHORT_URL = "https://youtu.be/"
TWITTER_URL = "https://twitter.com/"
TWITTER_SHORT_URL = "https://t.co/"
TWITTER_BEARER_TOKEN = os.getenv("TWITTER_BEARER_TOKEN")
OPENAI_TOKEN_THRESHOLD = 1536  # It's actually 4096, but we want to be safe
CONCURRENT = 4


def get_story(id: int, start: int, end: int) -> Story:
    global HN_STORY
    with requests.get(HN_STORY.format(id=id)) as submission:
        response = submission.json()
        story = Story(
            id=id,
            timestamp=int(response.get("time", 0)),
            title=response["title"],
            url=response.get("url", ""),
            hn_url=f"http://news.ycombinator.com/item?id={id}",
        )
    return story


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

    return Stories([story for story in stories if start <= story.timestamp <= end])


def download_story(story: Story) -> Story:
    from youtube_transcript_api import YouTubeTranscriptApi
    import bs4
    from urllib import parse

    global YT_URL
    global YT_SHORT_URL
    global TWITTER_URL
    global TWITTER_SHORT_URL
    global TWITTER_BEARER_TOKEN

    url = story.url

    if url.startswith(TWITTER_URL) or url.startswith(TWITTER_SHORT_URL):
        try:
            api = "https://api.twitter.com/2/tweets"
            headers: dict = {
                "Authorization": f"Bearer {TWITTER_BEARER_TOKEN}",
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
            tweet_id = url.split("/")[-1]
            r = requests.get(f"{api}?ids={tweet_id}", headers=headers)
            tweet = r.json()["data"][0]["text"]
            if "https://t.co" in tweet:
                urls = filter(lambda x: x.startswith("https://t.co"), tweet.split())
                for url in urls:
                    true_url = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}).url
                    r = requests.get(true_url, headers={"User-Agent": "Mozilla/5.0"})
                    story.content += bs4.BeautifulSoup(r.text, "html.parser").get_text()
        except Exception as e:
            print(e)
            print(f"Failed to download tweet from {story.title}, error: {e}")

    if url.startswith(YT_SHORT_URL) or url.startswith(YT_URL):
        try:
            video_id = parse.parse_qs(parse.urlparse(url).query)["v"][0]
            transcript = YouTubeTranscriptApi.get_transcript(video_id)
            story.content = ". ".join([t["text"] for t in transcript])
        except Exception as e:
            print(e)
            print(f"Failed to download YT transcript from {story.title}, error: {e}")

    try:
        r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        story.content += bs4.BeautifulSoup(r.text, "html.parser").get_text()
    except Exception as e:
        print(f"Failed to download main content from {story.title}, error: {e}")
    try:
        r = requests.get(story.hn_url, headers={"User-Agent": "Mozilla/5.0"})
        story.content += bs4.BeautifulSoup(r.text, "html.parser").get_text()
    except Exception as e:
        print(f"Failed to download HN comments from {story.title}, error: {e}")
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

    global OPENAI_TOKEN_THRESHOLD
    while len(story.content.split()) > OPENAI_TOKEN_THRESHOLD:
        story.content = shorten(story.content, OPENAI_TOKEN_THRESHOLD)
    story.title = get_title(story.title, story.content)
    story.summary = bulletpoint_summarize(story.title, story.content)
    return story


def summarize_stories(stories: Stories) -> Stories:
    from tqdm import tqdm

    new_stories = Stories()
    for _, story in enumerate(tqdm(stories)):
        story = summarize_story(story)
        if story.summary:
            new_stories.append(story)
    return new_stories
