from datetime import datetime, timedelta
from pytz import timezone
from hn import get_best_stories, download_stories, summarize_stories
from Story import Stories, Story
import json
import os
from babel.dates import format_date


def save_markdown(stories, locale):
    utc = timezone("UTC")
    today = (
        datetime.now()
        .astimezone(utc)
        .replace(hour=0, minute=0, second=0, microsecond=0)
    )
    filename = f"pages/{today.strftime('%Y/%m')}/{today.strftime('%d')}.{locale}.mdx"
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w") as f:
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        f.write(
            "\n\nimport { Steps } from 'nextra-theme-docs'\n\nimport CallToAction from '../../../components/CallToAction'\n\n<CallToAction />\n\n<Steps>\n\n"
            + "## "
            + format_date(today, format="long", locale=locale)
            + "\n\n"
        )
        for story in stories:
            f.write(f"{story.markdown()}\n\n")
        f.write("</Steps>")


def json_to_stories(json):
    stories = []
    for story in json:
        stories.append(Story(**story))
    return stories


if __name__ == "__main__":
    utc = timezone("UTC")
    today = (
        datetime.now()
        .astimezone(utc)
        .replace(hour=0, minute=0, second=0, microsecond=0)
    )
    yesterday = today - timedelta(days=1)
    start = int(yesterday.timestamp())
    end = int(today.timestamp())

    filename = (
        f"records/{today.strftime('%Y-%m-%d')}/{today.strftime('%Y-%m-%d')}.en.json"
    )
    if os.path.exists(filename):
        with open(filename, "r") as f:
            data = json.load(f)
            stories = json_to_stories(data)
    else:
        stories = get_best_stories(start, end)
        print(f"\nFound {len(stories)} stories")
        stories = download_stories(stories)
        print(f"\nDownloaded {len(stories)} stories")
        stories = summarize_stories(stories)
        print(f"\nSummarized {len(stories)} stories")

    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w") as f:
        json.dump(stories, f, indent=4, default=lambda o: o.__dict__)

    filename = f"pages/{today.strftime('%Y/%m')}/{today.strftime('%d')}.en.mdx"
    save_markdown(stories, "en")
    # meta_json_hander()
