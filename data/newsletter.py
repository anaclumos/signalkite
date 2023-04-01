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
    "en": "This is hn.cho.sh on a mission to deliver the hottest tech news to everyone across the globe 🌏. By passing this newsletter along to your buddies, you'll be giving the boost it needs to flourish 🌱🚀. Even better if you can recommend it to your international friends 🙊 ! We support 29 languages 💬",
    "bg": "Това е hn.cho.sh с мисия да доставя най-горещите технологични новини на всички по света 🌏. Предавайки този бюлетин на приятелите си, вие ще дадете необходимия тласък, за да процъфти 🌱🚀. Още по-добре е, ако можете да го препоръчате на своите международни приятели 🙊 ! Поддържаме 29 езика 💬",
    "cs": "Tohle je hn.cho.sh, jehož posláním je přinášet nejžhavější technologické novinky všem po celém světě 🌏. Předáním tohoto zpravodaje svým kamarádům mu dodáte potřebný impuls k rozkvětu 🌱🚀. Ještě lepší bude, když ho doporučíte svým zahraničním přátelům 🙊 ! Podporujeme 29 jazyků 💬",
    "da": "Dette er hn.cho.sh på en mission om at levere de hotteste tech-nyheder til alle i hele verden 🌏. Ved at give dette nyhedsbrev videre til dine venner, giver du det skub, det har brug for for at blomstre 🌱🚀. Endnu bedre, hvis du kan anbefale det til dine internationale venner 🙊 ! Vi understøtter 29 sprog 💬",
    "de": "Wir von hn.cho.sh haben es uns zur Aufgabe gemacht, jedem auf der ganzen Welt die heißesten Tech-News zu liefern 🌏. Wenn du diesen Newsletter an deine Freunde weitergibst, gibst du ihm den Schub, den er braucht, um zu gedeihen 🌱🚀. Noch besser ist es, wenn Sie ihn Ihren internationalen Freunden empfehlen können 🙊 ! Wir unterstützen 29 Sprachen 💬",
    "el": "Αυτό είναι το hn.cho.sh σε μια αποστολή να παραδώσει τις πιο καυτές τεχνολογικές ειδήσεις σε όλους σε όλο τον κόσμο 🌏. Δίνοντας αυτό το ενημερωτικό δελτίο στους φίλους σας, θα του δώσετε την ώθηση που χρειάζεται για να ανθίσει 🌱🚀. Ακόμα καλύτερα αν μπορείτε να το συστήσετε στους διεθνείς φίλους σας 🙊 ! Υποστηρίζουμε 29 γλώσσες 💬",
    "es": "Esto es hn.cho.sh, con la misión de hacer llegar las noticias tecnológicas más candentes a todo el mundo 🌏. Si pasas este boletín a tus amigos, le darás el impulso que necesita para florecer 🌱🚀. ¡Mejor aún si se lo recomiendas a tus amigos internacionales 🙊 ! Admitimos 29 idiomas 💬",
    "et": "See on hn.cho.sh, mille eesmärk on edastada kuumimad tehnoloogiauudised kõigile üle maailma 🌏. Edastades seda uudiskirja oma sõpradele, annad sa sellele õitsenguks vajaliku tõuke 🌱🚀. Veelgi parem, kui saad seda oma rahvusvahelistele sõpradele soovitada 🙊 ! Toetame 29 keelt 💬",
    "fi": "Tämä on hn.cho.sh, jonka tehtävänä on toimittaa kuumimmat teknologiauutiset kaikille ympäri maailmaa 🌏. Välittämällä tämän uutiskirjeen eteenpäin kavereillesi, annat sen tarvitseman sysäyksen kukoistukseen 🌱🚀. Vielä parempi, jos voit suositella sitä kansainvälisille ystävillesi 🙊 ! Tuemme 29 kieltä 💬",
    "fr": "Ceci est hn.cho.sh sur une mission de livrer les nouvelles tech les plus chaudes à tout le monde à travers le monde 🌏. En transmettant cette newsletter à vos copains, vous lui donnerez le coup de pouce dont elle a besoin pour s'épanouir 🌱🚀. Encore mieux si vous pouvez la recommander à vos amis internationaux 🙊 ! Nous prenons en charge 29 langues 💬",
    "hu": "A hn.cho.sh küldetése, hogy a legfrissebb technológiai híreket juttassa el mindenkihez világszerte 🌏. Ha továbbadod ezt a hírlevelet a haverjaidnak, ezzel megadod a virágzáshoz szükséges lökést 🌱🚀. Még jobb, ha nemzetközi barátaidnak is tudod ajánlani 🙊 ! 29 nyelvet támogatunk 💬",
    "id": "Ini adalah hn.cho.sh yang memiliki misi untuk menyampaikan berita teknologi terbaru kepada semua orang di seluruh dunia 🌏. Dengan menyebarkan buletin ini ke teman-teman Anda, Anda akan memberikan dorongan yang dibutuhkan untuk berkembang 🌱🚀. Lebih baik lagi jika Anda dapat merekomendasikannya kepada teman-teman internasional Anda 🙊! Kami mendukung 29 bahasa 💬",
    "it": "Questo è hn.cho.sh, con la missione di fornire le notizie tecnologiche più interessanti a tutti in tutto il mondo 🌏. Passando questa newsletter ai vostri amici, darete la spinta necessaria per farla crescere 🌱🚀. Ancora meglio se potete consigliarla ai vostri amici internazionali 🙊 ! Supportiamo 29 lingue 💬",
    "ja": "こちらはhn.cho.shで、世界中の皆さんにホットな技術ニュースをお届けすることを使命としています🌏。このニュースレターを仲間に渡すことで、ニュースレターが発展するために必要な後押しをすることになります🌱🚀。海外の友人にも勧めていただけるとさらに嬉しいです🙊 ！ 29言語💬に対応しています。",
    "ko": "전 세계 모든 사람에게 가장 핫한 기술 뉴스를 전달하는 사명을 가진 hn.cho.sh입니다 🌏. 이 뉴스레터를 친구들에게 전달해 주시면, 이 뉴스레터가 번창하는 데 필요한 힘을 보태주실 수 있습니다 🌱🚀. 해외 친구들에게 추천할 수 있다면 더욱 좋아요 🙊 ! 29개 언어를 지원하거든요 💬",
    "lt": "Tai yra hn.cho.sh, kurio misija - pristatyti karščiausias technologijų naujienas visiems visame pasaulyje 🌏. Perduodami šį naujienlaiškį savo bičiuliams, suteiksite jam reikiamą postūmį klestėti 🌱🚀. Dar geriau, jei galėsite jį rekomenduoti savo tarptautiniams draugams 🙊 ! Palaikome 29 kalbas 💬",
    "lv": "Šī ir hn.cho.sh misija, kuras mērķis ir sniegt karstākās tehnoloģiju ziņas ikvienam visā pasaulē 🌏. Nododot šo biļetenu tālāk saviem draugiem, jūs dosiet tam vajadzīgo stimulu, lai tas uzplaukstu 🌱🚀. Vēl labāk, ja jūs varēsiet to ieteikt saviem starptautiskajiem draugiem 🙊 ! Mēs atbalstām 29 valodas 💬",
    "nl": "Dit is hn.cho.sh op een missie om het heetste technieuws aan iedereen over de hele wereld te leveren 🌏. Door deze nieuwsbrief door te geven aan je vrienden, geef je de impuls die het nodig heeft om te bloeien 🌱🚀. Nog beter is het als je hem aanbeveelt aan je internationale vrienden 🙊 ! We ondersteunen 29 talen 💬",
    "nb": "Dette er hn.cho.sh på oppdrag for å levere de hotteste teknologinyhetene til alle over hele verden 🌏. Ved å sende dette nyhetsbrevet videre til vennene dine, gir du det løftet det trenger for å blomstre 🌱🚀. Enda bedre hvis du kan anbefale det til dine internasjonale venner �� ! Vi støtter 29 språk 💬.",
    "pl": "To jest hn.cho.sh z misją dostarczenia najgorętszych wiadomości technologicznych dla każdego na całym świecie 🌏. Przekazując ten biuletyn swoim znajomym, dajesz mu impuls do rozkwitu 🌱🚀. Jeszcze lepiej, jeśli polecisz go swoim międzynarodowym przyjaciołom 🙊 ! Obsługujemy 29 języków 💬",
    "pt": "Este é o hn.cho.sh numa missão para entregar as notícias tecnológicas mais quentes a todos em todo o mundo 🌏. Ao passar esta newsletter aos seus amigos, estará a dar o impulso de que necessita para florescer 🌱🚀. Melhor ainda se o puder recomendar aos seus amigos internacionais 🙊 ! Apoiamos 29 línguas 💬",
    "ro": "Acesta este hn.cho.sh cu misiunea de a oferi cele mai tari știri despre tehnologie tuturor celor de pe glob 🌏. Transmițând acest buletin informativ prietenilor tăi, vei da impulsul de care are nevoie pentru a înflori 🌱🚀. Chiar mai bine dacă îl poți recomanda prietenilor tăi internaționali 🙊 ! Acceptăm 29 de limbi 💬",
    "ru": "Это hn.cho.sh с миссией донести самые горячие новости технологий до всех по всему миру 🌏. Передавая эту рассылку своим друзьям, вы дадите ей толчок, необходимый для процветания 🌱🚀. Еще лучше, если вы порекомендуете его своим зарубежным друзьям 🙊 ! Мы поддерживаем 29 языков 💬",
    "sk": "Toto je hn.cho.sh, ktorého poslaním je prinášať najhorúcejšie technologické novinky všetkým na celom svete 🌏. Ak tento newsletter pošlete ďalej svojim kamarátom, dodáte mu potrebný impulz na rozkvet 🌱🚀. Ešte lepšie bude, ak ho odporučíte svojim zahraničným priateľom 🙊 ! Podporujeme 29 jazykov 💬",
    "sl": "To je hn.cho.sh, katerega poslanstvo je zagotoviti najbolj vroče tehnološke novice vsem po vsem svetu 🌏. Če boste te novice posredovali svojim prijateljem, jim boste dali zagon, ki ga potrebujejo za svoj razcvet 🌱🚀. Še bolje bo, če ga boste priporočili svojim mednarodnim prijateljem 🙊 ! Podpiramo 29 jezikov 💬",
    "sv": "Det här är hn.cho.sh som har som mål att leverera de hetaste tekniknyheterna till alla över hela världen 🌏. Genom att skicka det här nyhetsbrevet vidare till dina kompisar ger du det uppsving det behöver för att blomstra 🌱🚀. Ännu bättre om du kan rekommendera det till dina internationella vänner 🙊 ! Vi stöder 29 språk 💬",
    "tr": "Bu hn.cho.sh, dünyanın dört bir yanındaki herkese en yeni teknoloji haberlerini ulaştırma misyonuyla yola çıktı 🌏. Bu bülteni arkadaşlarınıza ileterek, gelişmesi için ihtiyaç duyduğu desteği vermiş olacaksınız 🌱🚀. Uluslararası arkadaşlarınıza tavsiye ederseniz daha da iyi olur 🙊 ! 29 dili destekliyoruz 💬",
    "uk": "Це hn.cho.sh з місією доставляти найгарячіші технологічні новини для всіх по всьому світу 🌏. Передаючи цю розсилку своїм друзям, ви дасте поштовх, необхідний для її процвітання 🌱🚀. Ще краще, якщо ви зможете порекомендувати її своїм міжнародним друзям 🙊! Ми підтримуємо 29 мов 💬.",
    "zh": "这里是hn.cho.sh，我们的使命是向全球各地的人提供最热门的科技新闻🌏。如果你把这份通讯传递给你的朋友，你将会给它带来蓬勃发展所需的动力🌱🚀。如果你能把它推荐给你的国际朋友就更好了🙊! 我们支持29种语言 💬",
}

text2 = {k: v + " " + text2[k] for k, v in text2.items()}


def get_campaigns():
    """Get all campaigns"""
    return requests.get(server, auth=(username, password)).json()


def create_campaign(title, body, lang):
    """Create a new campaign"""
    utc = timezone("UTC")
    today = datetime.now().astimezone(utc).replace(hour=0, minute=0, second=0, microsecond=0)
    next_hour = datetime.now().astimezone(utc).replace(minute=0, second=0, microsecond=0) + timedelta(
        minutes=CONFIG[lang] * 1 + 30
    )

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
