import requests
from datetime import datetime, timedelta
import os
import frontmatter
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
    "en": "hn.cho.sh is an initiative to provide access to the latest tech news to everyone. Please share this your friend; it helps out a lot.",
    "bg": "hn.cho.sh е инициатива за осигуряване на достъп до най-новите технологични новини за всички. Моля, споделете това с ваш приятел; това помага много.",
    "cs": "hn.cho.sh je iniciativa, jejímž cílem je poskytnout všem přístup k nejnovějším technologickým novinkám. Prosím, sdílejte ji se svými přáteli; velmi to pomůže.",
    "da": "hn.cho.sh er et initiativ, der har til formål at give alle adgang til de seneste tekniske nyheder. Vær venlig at dele dette med dine venner; det hjælper meget.",
    "de": "hn.cho.sh ist eine Initiative, die jedem Zugang zu den neuesten technischen Nachrichten verschaffen soll. Bitte teilen Sie diese Seite mit Ihren Freunden; sie hilft ihnen sehr.",
    "el": "Το hn.cho.sh είναι μια πρωτοβουλία για την παροχή πρόσβασης στις τελευταίες τεχνολογικές ειδήσεις σε όλους. Παρακαλώ μοιραστείτε αυτό το μήνυμα με τους φίλους σας, βοηθάει πολύ.",
    "es": "hn.cho.sh es una iniciativa para facilitar el acceso a las últimas noticias tecnológicas a todo el mundo. Por favor, comparte esto con tus amigos; es de gran ayuda.",
    "et": "hn.cho.sh on algatus, mille eesmärk on pakkuda kõigile juurdepääsu uusimatele tehnoloogiauudistele. Palun jagage seda oma sõbrale; see aitab palju.",
    "fi": "hn.cho.sh on aloite, jonka tarkoituksena on tarjota uusimmat teknologiauutiset kaikkien saataville. Jaa tämä ystävällesi; se auttaa paljon.",
    "fr": "hn.cho.sh est une initiative visant à donner accès aux dernières nouvelles technologiques à tout le monde. N'hésitez pas à partager ce site avec vos amis, il vous sera d'une grande utilité.",
    "hu": "A hn.cho.sh egy olyan kezdeményezés, amelynek célja, hogy mindenki számára elérhetővé tegye a legfrissebb technológiai híreket. Kérjük, ossza meg ezt a barátja; sokat segít.",
    "id": "hn.cho.sh adalah sebuah inisiatif untuk memberikan akses ke berita teknologi terbaru kepada semua orang. Silakan bagikan ini kepada teman Anda; ini sangat membantu.",
    "it": "hn.cho.sh è un'iniziativa per fornire a tutti l'accesso alle ultime notizie tecnologiche. Condividete questo articolo con i vostri amici; è di grande aiuto.",
    "ja": "hn.cho.shは、最新の技術ニュースへのアクセスをすべての人に提供するための取り組みです。お友達とシェアしてください。",
    "ko": "hn.cho.sh는 모든 사람에게 최신 기술 뉴스에 대한 액세스를 제공하기 위한 이니셔티브입니다. 친구에게 공유해 주세요. 많은 도움이 됩니다.",
    "lt": "hn.cho.sh - tai iniciatyva, kuria siekiama visiems suteikti prieigą prie naujausių technologijų naujienų. Pasidalykite šia informacija su savo draugu; tai labai padeda.",
    "lv": "hn.cho.sh ir iniciatīva, kuras mērķis ir nodrošināt piekļuvi jaunākajām tehnoloģiju ziņām ikvienam. Lūdzu, dalieties ar to ar savu draugu; tas ļoti palīdz.",
    "nl": "hn.cho.sh is een initiatief om iedereen toegang te geven tot het laatste technieuws. Deel dit alsjeblieft je vriend; het helpt veel.",
    "nb": "hn.cho.sh er et initiativ for å gi alle tilgang til de siste teknologinyhetene. Vennligst del dette med vennene dine; det hjelper mye.",
    "pl": "hn.cho.sh jest inicjatywą mającą na celu zapewnienie dostępu do najnowszych wiadomości technicznych dla każdego. Proszę podziel się tym z przyjaciółmi; to bardzo pomaga.",
    "pt": "hn.cho.sh é uma iniciativa para dar acesso às últimas notícias tecnológicas a todos. Por favor, partilhe isto com o seu amigo; ajuda muito.",
    "ro": "hn.cho.sh este o inițiativă menită să ofere acces la cele mai recente știri din domeniul tehnologiei pentru toată lumea. Vă rugăm să împărtășiți acest lucru prietenului dvs.; ajută foarte mult.",
    "ru": "hn.cho.sh - это инициатива по предоставлению доступа к последним технологическим новостям для всех. Пожалуйста, поделитесь этим с друзьями, это очень помогает.",
    "sk": "hn.cho.sh je iniciatíva, ktorej cieľom je poskytnúť prístup k najnovším technickým správam pre každého. Zdieľajte to so svojím priateľom; veľmi to pomôže.",
    "sl": "hn.cho.sh je pobuda, ki vsem omogoča dostop do najnovejših tehnoloških novic. Prosimo, delite to s svojim prijateljem; to zelo pomaga.",
    "sv": "hn.cho.sh är ett initiativ för att ge alla tillgång till de senaste tekniska nyheterna. Dela detta med din vän, det hjälper oss mycket.",
    "tr": "hn.cho.sh herkese en son teknoloji haberlerine erişim sağlamak için bir girişimdir. Lütfen bunu arkadaşlarınızla paylaşın; çok yardımcı olur.",
    "uk": "hn.cho.sh - це ініціатива, яка надає доступ до останніх технологічних новин кожному. Будь ласка, поділіться цим з друзями, це дуже допомагає.",
    "zh": "hn.cho.sh是一个向所有人提供最新科技新闻的倡议。请与你的朋友分享，这对你有很大的帮助。",
}


def get_campaigns():
    """Get all campaigns"""
    return requests.get(server, auth=(username, password)).json()


def create_campaign(title, body, lang):
    """Create a new campaign"""
    utc = timezone("UTC")
    today = datetime.now().astimezone(utc).replace(hour=0, minute=0, second=0, microsecond=0)
    next_hour = datetime.now().astimezone(utc) + timedelta(minutes=CONFIG[lang] * 2 + 20)

    url = "https://hn.cho.sh/" + lang + "/" + today.strftime("%Y/%m/%d")

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
            "altbody": prefix + body,
            "lists": [CONFIG[lang]],
            "send_at": f"{today.strftime('%Y-%m-%d')}T{next_hour.strftime('%H:%M:%S')}+00:00",
        },
    ).json()
    print(f"{today.strftime('%Y-%m-%d')}T{next_hour.strftime('%H:%M:%S')}+00:00")
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
            post = frontmatter.load(f)
            title = post.metadata["top_news"] or format_date(today, format="long", locale=lang) + " — hn.cho.sh/" + lang
            body = post.content
            body = (
                body.replace("import { Steps } from 'nextra-theme-docs'", "")
                .replace("<Steps>", "")
                .replace("</Steps>", "")
                .replace("import CallToAction from '../../../components/CallToAction'", "")
                .replace("<CallToAction />", "")
            )
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
                    break
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
