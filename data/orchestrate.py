from datetime import datetime, timedelta
from pytz import timezone
from hn import get_best_stories, download_stories, summarize_stories
import json

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

    filename = f"pages/{today.strftime('%Y/%m')}/{today.strftime('%Y-%m-%d')}.en.md"

    import os

    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w") as f:
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        f.write(f"# {today.strftime('%Y-%m-%d')}\n\n")
        for story in stories:
            f.write(f"{story.markdown()}\n\n")
