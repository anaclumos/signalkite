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
    "en": "This is hn.cho.sh, a project created to make fast tech news accessible to speakers of all languages around the world. Sharing this newsletter with your friends and colleagues will help this project grow. It's even better if you can recommend it to your foreign friends 🙊",
    "bg": "Това е hn.cho.sh - проект, създаден, за да направи бързите технологични новини достъпни за хората, говорещи всички езици по света. Споделянето на този бюлетин с вашите приятели и колеги ще помогне за развитието на проекта. Още по-добре е, ако можете да го препоръчате на своите чуждестранни приятели 🙊",
    "cs": "Toto je hn.cho.sh, projekt vytvořený s cílem zpřístupnit rychlé technologické zprávy mluvčím všech jazyků na celém světě. Sdílení tohoto zpravodaje s vašimi přáteli a kolegy pomůže tomuto projektu růst. Ještě lepší bude, když ho doporučíte svým zahraničním přátelům 🙊.",
    "da": "Dette er hn.cho.sh, et projekt, der er skabt for at gøre hurtige teknologiske nyheder tilgængelige for talere af alle sprog i hele verden. Hvis du deler dette nyhedsbrev med dine venner og kolleger, vil det hjælpe projektet med at vokse. Det er endnu bedre, hvis du kan anbefale det til dine udenlandske venner 🙊",
    "de": "Dies ist hn.cho.sh, ein Projekt, das schnelle technische Nachrichten für Sprecher aller Sprachen auf der ganzen Welt zugänglich machen soll. Wenn Sie diesen Newsletter mit Ihren Freunden und Kollegen teilen, wird dieses Projekt wachsen. Noch besser ist es, wenn Sie ihn Ihren ausländischen Freunden empfehlen können 🙊",
    "el": "Αυτό είναι το hn.cho.sh, ένα έργο που δημιουργήθηκε για να κάνει τις γρήγορες τεχνολογικές ειδήσεις προσιτές σε ομιλητές όλων των γλωσσών σε όλο τον κόσμο. Μοιραστείτε αυτό το ενημερωτικό δελτίο με τους φίλους και τους συναδέλφους σας και θα βοηθήσετε αυτό το έργο να αναπτυχθεί. Είναι ακόμα καλύτερο αν μπορείτε να το συστήσετε στους ξένους φίλους σας 🙊.",
    "es": "Esto es hn.cho.sh, un proyecto creado para hacer accesibles las noticias tecnológicas rápidas a hablantes de todas las lenguas del mundo. Compartir este boletín con tus amigos y colegas ayudará a que este proyecto crezca. Mejor aún si puedes recomendarlo a tus amigos extranjeros 🙊.",
    "et": "See on hn.cho.sh, projekt, mis on loodud selleks, et teha kiired tehnoloogiauudised kättesaadavaks kõikide keelte kõnelejatele üle kogu maailma. Selle uudiskirja jagamine oma sõprade ja kolleegidega aitab sellel projektil kasvada. Veelgi parem on, kui saate seda oma välismaistele sõpradele soovitada 🙊.",
    "fi": "Tämä on hn.cho.sh, hanke, joka on luotu tuomaan nopeat teknologiauutiset kaikkien kielten puhujien saataville ympäri maailmaa. Tämän uutiskirjeen jakaminen ystävillesi ja kollegoillesi auttaa tätä projektia kasvamaan. On vielä parempi, jos voit suositella sitä ulkomaalaisille ystävillesi 🙊.",
    "fr": "Voici hn.cho.sh, un projet créé pour rendre l'actualité technologique rapide accessible aux locuteurs de toutes les langues à travers le monde. En partageant cette lettre d'information avec vos amis et collègues, vous aiderez ce projet à se développer. C'est encore mieux si vous pouvez la recommander à vos amis étrangers 🙊",
    "hu": "Ez a hn.cho.sh, egy projekt, amelyet azért hoztak létre, hogy a gyors technológiai híreket a világ minden nyelvének beszélői számára elérhetővé tegye. Ha megosztod ezt a hírlevelet barátaiddal és kollégáiddal, az segíthet a projekt fejlődésében. Még jobb, ha külföldi barátaidnak is tudod ajánlani 🙊.",
    "id": "Ini adalah hn.cho.sh, sebuah proyek yang dibuat untuk membuat berita teknologi cepat dapat diakses oleh para penutur semua bahasa di seluruh dunia. Membagikan buletin ini kepada teman dan kolega Anda akan membantu proyek ini berkembang. Lebih baik lagi jika Anda dapat merekomendasikannya kepada teman-teman Anda yang berada di luar negeri 🙊",
    "it": "Questo è hn.cho.sh, un progetto creato per rendere accessibili le notizie tecnologiche veloci a chi parla tutte le lingue del mondo. Condividere questa newsletter con i vostri amici e colleghi aiuterà questo progetto a crescere. È ancora meglio se potete consigliarlo ai vostri amici stranieri 🙊",
    "ja": "hn.cho.shは、世界中のあらゆる言語を話す人たちが、高速な技術ニュースにアクセスできるようにするために作られたプロジェクトです。このニュースレターをお友達や同僚と共有することで、このプロジェクトが成長することができます。外国人の友人にも勧めていただけると、さらにうれしいです🙊。",
    "ko": "세상 모든 언어 화자들도 빠른 기술 뉴스를 접할 수 있도록 만든 프로젝트 hn.cho.sh 입니다. 친구 및 동료에게 이 뉴스레터를 공유해주시면 이 프로젝트가 성장하는 데 큰 도움이 됩니다. 외국인 친구에게 추천해주시면 더욱 좋습니다 🙊",
    "lt": "Tai yra hn.cho.sh - projektas, sukurtas siekiant, kad greitos technologijų naujienos būtų prieinamos visų pasaulio kalbų vartotojams. Dalydamiesi šiuo naujienlaiškiu su savo draugais ir kolegomis padėsite šiam projektui augti. Dar geriau, jei galėsite jį rekomenduoti savo draugams užsieniečiams 🙊",
    "lv": "Šis ir hn.cho.sh - projekts, kas izveidots, lai ātras tehnoloģiju ziņas būtu pieejamas visu pasaules valodu lietotājiem. Daloties ar šo jaunumu ar saviem draugiem un kolēģiem, palīdzēsiet šim projektam attīstīties. Vēl labāk, ja jūs to ieteiksiet saviem ārzemju draugiem 🙊.",
    "nl": "Dit is hn.cho.sh, een project dat is opgezet om snel technieuws toegankelijk te maken voor sprekers van alle talen over de hele wereld. Het delen van deze nieuwsbrief met je vrienden en collega's zal dit project helpen groeien. Het is nog beter als je hem aanbeveelt aan je buitenlandse vrienden 🙊",
    "nb": "Dette er hn.cho.sh, et prosjekt som er opprettet for å gjøre raske teknologinyheter tilgjengelig for alle språkbrukere over hele verden. Hvis du deler dette nyhetsbrevet med venner og kolleger, hjelper du prosjektet med å vokse. Det er enda bedre hvis du kan anbefale det til dine utenlandske venner 🙊.",
    "pl": "To jest hn.cho.sh, projekt stworzony w celu udostępnienia szybkich wiadomości technologicznych osobom posługującym się wszystkimi językami na całym świecie. Dzielenie się tym newsletterem ze swoimi przyjaciółmi i kolegami pomoże temu projektowi się rozwijać. Jeszcze lepiej będzie, jeśli polecisz go swoim zagranicznym znajomym 🙊",
    "pt": "Este é o hn.cho.sh, um projecto criado para tornar as notícias tecnológicas rápidas acessíveis a falantes de todas as línguas em todo o mundo. Partilhar este boletim informativo com os seus amigos e colegas ajudará a este projecto a crescer. É ainda melhor se o puder recomendar aos seus amigos estrangeiros 🙊",
    "ro": "Acesta este hn.cho.sh, un proiect creat pentru a face știrile rapide din domeniul tehnologiei accesibile vorbitorilor de toate limbile din întreaga lume. Împărtășirea acestui buletin informativ cu prietenii și colegii dvs. va contribui la dezvoltarea acestui proiect. Este chiar mai bine dacă îl puteți recomanda prietenilor dvs. străini 🙊.",
    "ru": "Это hn.cho.sh, проект, созданный для того, чтобы сделать новости быстрого технического прогресса доступными для носителей всех языков мира. Если вы поделитесь этой рассылкой со своими друзьями и коллегами, это поможет проекту развиваться. Будет еще лучше, если вы порекомендуете его своим иностранным друзьям 🙊.",
    "sk": "Toto je hn.cho.sh, projekt vytvorený s cieľom sprístupniť rýchle technické správy používateľom všetkých jazykov na celom svete. Zdieľanie tohto spravodajcu s vašimi priateľmi a kolegami pomôže tomuto projektu rásť. Ešte lepšie bude, ak ho odporučíte svojim zahraničným priateľom 🙊",
    "sl": "To je hn.cho.sh, projekt, ki je bil ustvarjen, da bi hitre tehnološke novice postale dostopne govorcem vseh jezikov po vsem svetu. Če boste te novice delili s svojimi prijatelji in sodelavci, boste pripomogli k rasti tega projekta. Še bolje bo, če ga boste priporočili svojim prijateljem iz tujine 🙊",
    "sv": "Det här är hn.cho.sh, ett projekt som skapats för att göra snabba tekniska nyheter tillgängliga för talare av alla språk runt om i världen. Om du delar detta nyhetsbrev med dina vänner och kollegor hjälper du projektet att växa. Det är ännu bättre om du kan rekommendera det till dina utländska vänner 🙊.",
    "tr": "Bu hn.cho.sh, hızlı teknoloji haberlerini dünyanın dört bir yanındaki tüm dilleri konuşanlar için erişilebilir hale getirmek için oluşturulmuş bir projedir. Bu bülteni arkadaşlarınızla ve meslektaşlarınızla paylaşmanız bu projenin büyümesine yardımcı olacaktır. Yabancı arkadaşlarınıza tavsiye edebilirseniz daha da iyi olur 🙊",
    "uk": "Це hn.cho.sh, проект, створений для того, щоб зробити швидкі технологічні новини доступними для носіїв усіх мов світу. Якщо ви поділитеся цією розсилкою з друзями та колегами, це допоможе проекту розвиватися. Ще краще, якщо ви зможете порекомендувати його своїм іноземним друзям 🙊.",
    "zh": "这是hn.cho.sh，一个为了让全世界所有语言的人都能获得快速科技新闻而创建的项目。与你的朋友和同事分享这份通讯将有助于这个项目的发展。如果你能把它推荐给你的外国朋友就更好了 🙊",
}


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
