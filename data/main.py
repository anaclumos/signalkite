from datetime import datetime, timedelta
from pytz import timezone
from hn import get_best_stories, download_stories, summarize_stories
import json
from translate import translate_story
import os
from babel.dates import format_date


def save_markdown(stories, locale):
    tz = timezone("UTC")
    today = tz.localize(datetime.today()).replace(hour=0, minute=0, second=0, microsecond=0)

    filename = f"pages/{today.strftime('%Y/%m')}/{today.strftime('%d')}.{locale}.mdx"
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w") as f:
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        f.write(f"# {format_date(today, format='long', locale=locale)}\n\n")
        for story in stories:
            f.write(f"{story.markdown()}\n\n")


if __name__ == "__main__":

    tz = timezone("UTC")
    yesterday = tz.localize(datetime.today()).replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=1)
    today = tz.localize(datetime.today()).replace(hour=0, minute=0, second=0, microsecond=0)
    start = int(yesterday.timestamp())
    end = int(today.timestamp())

    stories = get_best_stories(start, end)
    stories = download_stories(stories)
    stories = summarize_stories(stories)

    filename = f"records/{today.strftime('%Y-%m-%d')}.en.json"

    with open(filename, "w") as f:
        json.dump([story.__dict__ for story in stories], f)

    filename = f"pages/{today.strftime('%Y/%m')}/{today.strftime('%d')}.en.mdx"
    save_markdown(stories, "en")

    locales = ["bg", "cs", "da", "de", "el", "es", "et", "fi", "fr", "hu", "id", "it", "ja", "ko", "lt", "lv", "nl", "no", "pl", "pt", "ro", "ru", "sk", "sl", "sv", "tr", "uk", "zh"]

    for locale in locales:
        stories = translate_story(stories, locale)
        save_markdown(stories, locale)
