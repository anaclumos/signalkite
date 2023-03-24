import deepl
from Story import Story, Stories
import os
from dotenv import load_dotenv

load_dotenv()


def translate_story(story: Story, locale: str) -> Story:
    translator = deepl.Translator(os.getenv("DEEPL_API_KEY"))
    translated = Story()
    translated.title = translator.translate_text(story.title, target_lang=locale)
    translated.summary = translator.translate_text(story.url, target_lang=locale)
    translated.locale = locale
    translated.id = story.id
    translated.content = story.content
    translated.timestamp = story.timestamp
    translated.hn_url = story.hn_url
    return translated


def translate_stories(stories: Stories, locale: str) -> Stories:
    translated_stories = Stories()
    for story in stories:
        translated_stories.append(translate_story(story, locale))
    return translated_stories
