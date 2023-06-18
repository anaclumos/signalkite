import deepl
import os
from dotenv import load_dotenv

load_dotenv()

language = [
    {"locale": "bg", "filename_locale": "bg", "text": "български (bg)"},
    {"locale": "cs", "filename_locale": "cs", "text": "Čeština (cs)"},
    {"locale": "da", "filename_locale": "da", "text": "Dansk (da)"},
    {"locale": "de", "filename_locale": "de", "text": "Deutsch (de)"},
    {"locale": "el", "filename_locale": "el", "text": "Ελληνικά (el)"},
    {"locale": "en", "filename_locale": "en", "text": "English (en)"},
    {"locale": "es", "filename_locale": "es", "text": "Espanya (es)"},
    {"locale": "et", "filename_locale": "et", "text": "Eesti (et)"},
    {"locale": "fi", "filename_locale": "fi", "text": "Suomi (fi)"},
    {"locale": "fr", "filename_locale": "fr", "text": "Français (fr)"},
    {"locale": "hu", "filename_locale": "hu", "text": "Magyar (hu)"},
    {"locale": "id", "filename_locale": "id", "text": "Bahasa Indonesia (id)"},
    {"locale": "it", "filename_locale": "it", "text": "Italiano (it)"},
    {"locale": "ja", "filename_locale": "ja", "text": "日本語 (ja)"},
    {"locale": "ko", "filename_locale": "ko", "text": "한국어 (ko)"},
    {"locale": "lt", "filename_locale": "lt", "text": "Lietuvių (lt)"},
    {"locale": "lv", "filename_locale": "lv", "text": "Latviešu (lv)"},
    {"locale": "nl", "filename_locale": "nl", "text": "Nederlands (nl)"},
    {"locale": "nb", "filename_locale": "nb", "text": "Bokmål (nb)"},
    {"locale": "pl", "filename_locale": "pl", "text": "Polski (pl)"},
    {"locale": "PT-PT", "filename_locale": "pt", "text": "Português (pt)"},
    {"locale": "ro", "filename_locale": "ro", "text": "Română (ro)"},
    {"locale": "ru", "filename_locale": "ru", "text": "Русский (ru)"},
    {"locale": "sk", "filename_locale": "sk", "text": "Slovenčina (sk)"},
    {"locale": "sl", "filename_locale": "sl", "text": "Slovenščina (sl)"},
    {"locale": "sv", "filename_locale": "sv", "text": "Svenska (sv)"},
    {"locale": "tr", "filename_locale": "tr", "text": "Türkçe (tr)"},
    {"locale": "uk", "filename_locale": "uk", "text": "Українська (uk)"},
    {"locale": "zh", "filename_locale": "zh", "text": "中文 (zh)"},
]

if __name__ == "__main__":
    # ask for user input in English
    file = open("pages/_meta.en.json", "r")
    text = file.read()
    file.close()
    translator = deepl.Translator(os.getenv("DEEPL_API_KEY"))

    key_to_translate = ["index", "manifesto", "subscribe", "contact.title"]

    for lang in language:
        # parse as json, so we can access the keys
        import json

        if lang["locale"] == "en":
            continue

        json_data = json.loads(text)
        for key in key_to_translate:
            # translate the key
            if key == "contact.title":
                original = json_data["contact"]["title"]
            else:
                original = json_data[key]
            translated = translator.translate_text(
                original, target_lang=lang["locale"]
            ).text
            # replace the key with the translated key
            if key == "contact.title":
                json_data["contact"]["title"] = translated
            else:
                json_data[key] = translated
            # copy other keys
        # write the translated json to a file
        with open(f"pages/_meta.{lang['filename_locale']}.json", "w") as f:
            json.dump(json_data, f, indent=4, ensure_ascii=False)
            print(f"Translated to {lang['text']}")
