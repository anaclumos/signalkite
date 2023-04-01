import requests
from datetime import datetime, timedelta
import os
from pytz import timezone
from dotenv import load_dotenv
from resend import Resend
from babel.dates import format_date

load_dotenv()

server = "https://newsletters.cho.sh/api/campaigns"
username = os.environ["NEWSLETTERS_CHO_SH_USERNAME"]
password = os.environ["NEWSLETTERS_CHO_SH_PASSWORD"]
resend = Resend(os.environ["RESEND_KEY"])
notification = ""

CONFIG = {
    "zh": 34,
    "uk": 33,
    "tr": 32,
    "sv": 31,
    "sl": 30,
    "sk": 29,
    "ru": 28,
    "ro": 27,
    "pt": 26,
    "pl": 25,
    "nb": 24,
    "nl": 23,
    "lv": 22,
    "lt": 21,
    "ko": 20,
    "ja": 19,
    "it": 18,
    "id": 17,
    "hu": 16,
    "fr": 15,
    "fi": 14,
    "et": 13,
    "es": 12,
    "en": 11,
    "el": 10,
    "de": 9,
    "da": 8,
    "cs": 7,
    "bg": 6,
}

EMAIL_CTA = {
    'bg': 'Хареса ли ви статията? Споделете я с техническите си приятели по света и в многоезичните форуми! 😄🌏🚀',
    'cs': 'Líbil se vám článek? Podělte se o něj s kamarády techniky po celém světě a na vícejazyčných fórech! 😄🌏🚀',
    'da': 'Elskede du artiklen? Del den med tech-venner verden over og i flersprogede fora! 😄🌏🚀',
    'de': 'Hat Ihnen der Artikel gefallen? Teilen Sie ihn mit Technikfreunden weltweit und in mehrsprachigen Foren! 😄🌏🚀',
    'el': 'Σας άρεσε το άρθρο; Μοιραστείτε το με φίλους τεχνολογίας σε όλο τον κόσμο και σε πολύγλωσσα φόρουμ! 😄🌏🚀',
    'es': '¿Te ha gustado el artículo? Compártelo con tus amigos de la tecnología de todo el mundo y en foros multilingües. 😄🌏🚀',
    'et': 'Armastasite artiklit? Jaga seda tehnikavendadega üle maailma ja mitmekeelsetes foorumites! 😄🌏🚀',
    'en': 'Loved the article? Share it with tech pals worldwide and multilingual forums! 😄🌏🚀',
    'fi': 'Rakastitko artikkelia? Jaa se tekniikkakavereiden kanssa maailmanlaajuisesti ja monikielisillä foorumeilla! 😄🌏🚀',
    'fr': "Vous avez aimé l'article ? Partagez-le avec vos amis techniciens du monde entier et les forums multilingues ! 😄🌏🚀",
    'hu': 'Tetszett a cikk? Oszd meg a tech haverokkal világszerte és a többnyelvű fórumokon! 😄🌏🚀',
    'id': 'Anda menyukai artikel ini? Bagikan dengan teman-teman teknologi di seluruh dunia dan forum multibahasa! 😄🌏🚀',
    'it': "Ti è piaciuto l'articolo? Condividilo con gli amici tecnologici di tutto il mondo e con i forum multilingue! 😄🌏🚀",
    'ja': 'この記事を気に入りましたか？世界中の技術仲間や多言語フォーラムで共有しましょう！私たちのグローバルヒーローになりましょう！😄🌏🚀',
    'ko': '기사가 마음에 드셨나요? 전 세계 기술 동료 및 다국어 포럼과 공유해주세요! 😄🌏🚀',
    'lt': 'Patiko straipsnis? Pasidalykite juo su technikos bičiuliais visame pasaulyje ir daugiakalbiuose forumuose! 😄🌏🚀',
    'lv': 'Patika raksts? Dalieties tajā ar tehnoloģiju draugiem visā pasaulē un daudzvalodu forumos! 😄🌏🚀',
    'nl': 'Hield u van het artikel? Deel het met technische vrienden wereldwijd en meertalige forums! 😄🌏🚀',
    'nb': 'Likte du artikkelen? Del den med tech-venner over hele verden og i flerspråklige fora! 😄🌏🚀',
    'pl': 'Podobał Ci się ten artykuł? Podziel się nim z tech-przyjaciółmi na całym świecie i na wielojęzycznych forach! 😄🌏🚀',
    'pt': 'Adorou o artigo? Partilhe-o com amigos técnicos de todo o mundo e fóruns multilingues! 😄🌏🚀',
    'ro': 'Ți-a plăcut articolul? Împărtășiți-l cu prietenii de tehnologie din întreaga lume și pe forumurile multilingve! 😄🌏🚀',
    'ru': 'Понравилась статья? Поделитесь ею с друзьями-техниками по всему миру и на многоязычных форумах! 😄🌏🚀',
    'sk': 'Páčil sa vám článok? Podeľte sa oň s kamarátmi z technického sveta a viacjazyčných fór! 😄🌏🚀',
    'sl': 'Ali vam je bil članek všeč? Delite ga s tehničnimi prijatelji po vsem svetu in na večjezičnih forumih! 😄🌏🚀',
    'sv': 'Gillade du artikeln? Dela den med tekniska vänner världen över och i flerspråkiga forum! 😄🌏🚀',
    'tr': 'Makaleyi beğendiniz mi? Dünya çapındaki teknoloji dostlarınızla ve çok dilli forumlarda paylaşın! 😄🌏🚀',
    'uk': 'Сподобалася стаття? Поділіться нею з технічними друзями по всьому світу та на багатомовних форумах! 😄🌏🚀',
    'zh': '喜欢这篇文章吗？与世界各地的技术伙伴和多语言论坛分享吧!😄🌏🚀'
}

def get_campaigns():
    """Get all campaigns"""
    return requests.get(server, auth=(username, password)).json()


def create_campaign(title, body, lang):
    """Create a new campaign"""
    utc = timezone("UTC")
    today = datetime.now().astimezone(utc).replace(hour=0, minute=0, second=0, microsecond=0)
    next_hour = datetime.now().astimezone(utc).replace(minute=0, second=0, microsecond=0) + timedelta(minutes=CONFIG[lang] * 1 + 30)

    url = 'https://hn.cho.sh/' + lang + '/' + today.strftime('%Y/%m/%d')

    md_link = f"""\n\n[hn.cho.sh/{lang}/{today.strftime('%Y/%m/%d')}]({url})\n\n"""

    prefix = EMAIL_CTA[lang] + md_link

    res = requests.post(
        server,
        auth=(username, password),
        json={
            "name": title,
            "subject": title,
            "type": "regular",
            "content_type": "markdown",
            "body": prefix + body,
            "altbody": prefix +  body,
            "lists": [CONFIG[lang]],
            "send_at": f"{today.strftime('%Y-%m-%d')}T{next_hour.strftime('%H:%M:%S')}+00:00",
        },
    ).json()
    requests.put(
        server + "/" + str(res["data"]["id"]) + "/status",
        auth=(username, password),
        json={"status": "scheduled"},
    )


def find_today_newsletters(lang):
    """Find the newsletter for today in the Research folder. All UTC."""
    utc = timezone("UTC")
    today = datetime.now().astimezone(utc).replace(hour=0, minute=0, second=0, microsecond=0)
    filename = f"pages/{today.strftime('%Y/%m')}/{today.strftime('%d')}.{lang}.mdx"
    if os.path.exists(filename):
        with open(filename, "r") as f:
            body = f.read()
            title = format_date(today, format="long", locale=lang) + " — hn.cho.sh/" + lang
            body = body.replace("import { Steps } from 'nextra-theme-docs'", "").replace("<Steps>", "").replace("</Steps>", "").replace("import CallToAction from '../../../components/CallToAction'", "").replace("<CallToAction />", "")
            return [(title, body)]


def collect_device_info():
    import platform
    import psutil

    collect_notification("\n\n\nCollecting device information...")
    uname = platform.uname()
    collect_notification(f"System: {uname.system}")
    collect_notification(f"Node Name: {uname.node}")
    collect_notification(f"Release: {uname.release}")
    collect_notification(f"Version: {uname.version}")
    collect_notification(f"Machine: {uname.machine}")
    collect_notification(f"Processor: {uname.processor}")
    collect_notification("Physical cores:", psutil.cpu_count(logical=False))
    collect_notification("Total cores:", psutil.cpu_count(logical=True))
    cpufreq = psutil.cpu_freq()
    collect_notification(f"Max Frequency: {cpufreq.max:.2f}Mhz")
    collect_notification(f"Min Frequency: {cpufreq.min:.2f}Mhz")
    collect_notification(f"Current Frequency: {cpufreq.current:.2f}Mhz")
    collect_notification(f"Total CPU Usage: {psutil.cpu_percent()}%")


def notify(title, text):
    """Notify me about newsletter results."""
    resend.send_email(
        sender="notification@resend.dev",
        to="hey@cho.sh",
        subject=title,
        text=text,
    )


def collect_notification(*args):
    args = [str(arg) for arg in args]
    text = " ".join(args)
    """Collect notifications and send them at the end."""
    global notification
    notification += text + "\n"


def schedule_newsletter(lang):
    """Schedule the newsletter for today."""
    newsletters = find_today_newsletters(lang)
    if newsletters:
        campaigns = get_campaigns()["data"]["results"]
        for title, post in newsletters:
            duplicate = False
            for campaign in campaigns:
                if title in campaign["name"]:
                    collect_notification("Duplicate... ", title)
                    duplicate = True
            if not duplicate:
                collect_notification("Scheduling... ", title)
                create_campaign(title, post, lang)
    else:
        collect_notification(f"{lang}: No newsletter for today.")


if __name__ == "__main__":
    for lang in CONFIG:
        schedule_newsletter(lang)
    collect_device_info()
    notify(
        f"Newsletter Job {datetime.now().astimezone(timezone('US/Pacific')).strftime('%Y-%m-%d %H:%M:%S')}",
        notification,
    )
