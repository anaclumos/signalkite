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
    "en": "Generating this newsletter costs around $50 per day. I need to gather as much subscribers as possible to sustain this project free. I beg you to please consider sharing this to your friends, family, coworkers, and community.",
    "bg": "Генерирането на този бюлетин струва около 50 долара на ден. Трябва да събера възможно най-много абонати, за да поддържам този проект безплатен. Моля ви да обмислите възможността да го споделите с вашите приятели, семейство, колеги и общност.",
    "cs": "Vytvoření tohoto newsletteru stojí přibližně 50 dolarů denně. Potřebuji shromáždit co nejvíce odběratelů, abych tento projekt udržel zdarma. Prosím vás, abyste zvážili jeho sdílení mezi svými přáteli, rodinou, spolupracovníky a komunitou.",
    "da": "Det koster ca. 50 dollars om dagen at lave dette nyhedsbrev. Jeg har brug for at samle så mange abonnenter som muligt for at opretholde dette projekt gratis. Jeg beder dig om at overveje at dele dette til dine venner, familie, kollegaer og dit samfund.",
    "de": "Die Erstellung dieses Newsletters kostet etwa 50 Dollar pro Tag. Ich muss so viele Abonnenten wie möglich gewinnen, um dieses Projekt kostenlos aufrechtzuerhalten. Ich bitte Sie, dies Ihren Freunden, Ihrer Familie, Ihren Kollegen und Ihrer Gemeinde mitzuteilen.",
    "el": "Η παραγωγή αυτού του ενημερωτικού δελτίου κοστίζει περίπου 50 δολάρια την ημέρα. Πρέπει να συγκεντρώσω όσο το δυνατόν περισσότερους συνδρομητές για να διατηρήσω αυτό το έργο δωρεάν. Σας ικετεύω να σκεφτείτε να το μοιραστείτε με τους φίλους, την οικογένεια, τους συναδέλφους και την κοινότητά σας.",
    "es": "Generar este boletín cuesta unos 50 dólares al día. Necesito reunir el mayor número posible de suscriptores para mantener este proyecto de forma gratuita. Te ruego que por favor consideres compartir esto con tus amigos, familia, compañeros de trabajo y comunidad.",
    "et": "Selle uudiskirja koostamine maksab umbes 50 dollarit päevas. Mul on vaja koguda võimalikult palju tellijaid, et seda projekti tasuta säilitada. Palun kaaluge selle jagamist oma sõpradele, perele, töökaaslastele ja kogukonnale.",
    "fi": "Tämän uutiskirjeen tuottaminen maksaa noin 50 dollaria päivässä. Minun on kerättävä mahdollisimman paljon tilaajia, jotta voin ylläpitää tätä projektia ilmaiseksi. Pyydän teitä harkitsemaan tämän jakamista ystävillenne, perheellenne, työtovereillenne ja yhteisöllenne.",
    "fr": "La production de cette lettre d'information coûte environ 50 $ par jour. J'ai besoin de rassembler autant d'abonnés que possible pour maintenir ce projet gratuit. Je vous prie d'envisager de partager cette lettre d'information avec vos amis, votre famille, vos collègues et votre communauté.",
    "hu": "A hírlevél előállítása naponta körülbelül 50 dollárba kerül. Minél több feliratkozót kell gyűjtenem, hogy ingyenesen fenntarthassam ezt a projektet. Könyörgöm, hogy fontolja meg, hogy megosztja ezt barátaival, családjával, munkatársaival és közösségével.",
    "id": "Membuat buletin ini membutuhkan biaya sekitar $50 per hari. Saya perlu mengumpulkan pelanggan sebanyak mungkin untuk mempertahankan proyek ini secara gratis. Saya mohon Anda mempertimbangkan untuk membagikannya kepada teman, keluarga, rekan kerja, dan komunitas Anda.",
    "it": "Generare questa newsletter costa circa 50 dollari al giorno. Ho bisogno di raccogliere il maggior numero possibile di abbonati per sostenere questo progetto gratuitamente. Vi prego di considerare la possibilità di condividere questo progetto con i vostri amici, familiari, colleghi e comunità.",
    "ja": "このニュースレターの作成には、1日あたり50ドル程度のコストがかかります。このプロジェクトを無料で維持するためには、できるだけ多くの購読者を集める必要があります。どうか、あなたの友人、家族、同僚、そして地域社会にこのプロジェクトをシェアすることを検討してください。",
    "ko": "이 뉴스레터를 생성하는 데 하루에 약 $50의 비용이 듭니다. 이 프로젝트를 무료로 유지하려면 가능한 한 많은 구독자를 모아야 합니다. 친구, 가족, 동료, 커뮤니티에 공유해 주실 것을 부탁드리겠습니다.",
    "lt": "Šio naujienlaiškio rengimas kainuoja apie 50 JAV dolerių per dieną. Man reikia surinkti kuo daugiau prenumeratorių, kad šis projektas būtų nemokamas. Prašau apsvarstyti galimybę pasidalyti šiuo naujienlaiškiu su savo draugais, šeima, bendradarbiais ir bendruomene.",
    "lv": "Šī biļetena sagatavošana izmaksā aptuveni 50 ASV dolāru dienā. Man ir nepieciešams savākt pēc iespējas vairāk abonentu, lai uzturētu šo projektu bez maksas. Es lūdzu jūs apsvērt iespēju dalīties ar šo jaunumu ar saviem draugiem, ģimeni, kolēģiem un sabiedrību.",
    "nl": "Het genereren van deze nieuwsbrief kost ongeveer $50 per dag. Ik moet zoveel mogelijk abonnees verzamelen om dit project gratis te houden. Ik smeek je om alsjeblieft te overwegen dit te delen met je vrienden, familie, collega's en gemeenschap.",
    "nb": "Å generere dette nyhetsbrevet koster rundt 50 dollar per dag. Jeg trenger å samle så mange abonnenter som mulig for å opprettholde dette prosjektet gratis. Jeg ber deg vurdere å dele dette med venner, familie, kolleger og lokalsamfunn.",
    "pl": "Generowanie tego newslettera kosztuje około 50$ dziennie. Muszę zebrać jak najwięcej subskrybentów, aby utrzymać ten projekt za darmo. Błagam Cię o rozważenie udostępnienia tego projektu swoim przyjaciołom, rodzinie, współpracownikom i społeczności.",
    "pt": "A geração deste boletim custa cerca de 50 dólares por dia. Preciso de reunir o máximo de assinantes possível para sustentar este projecto gratuitamente. Peço-vos que considerem partilhar isto com os vossos amigos, família, colegas de trabalho e comunidade.",
    "ro": "Generarea acestui buletin informativ costă în jur de 50 de dolari pe zi. Am nevoie să strâng cât mai mulți abonați pentru a susține acest proiect gratuit. Vă rog să vă gândiți să luați în considerare posibilitatea de a împărtăși acest lucru prietenilor, familiei, colegilor de serviciu și comunității dumneavoastră.",
    "ru": "Создание этой рассылки стоит около $50 в день. Мне нужно собрать как можно больше подписчиков, чтобы поддерживать этот проект бесплатно. Я прошу вас, пожалуйста, подумайте о том, чтобы поделиться этим с вашими друзьями, семьей, коллегами и сообществом.",
    "sk": "Vytváranie tohto informačného bulletinu stojí približne 50 USD denne. Potrebujem získať čo najviac odberateľov, aby som tento projekt udržal zadarmo. Prosím vás, aby ste zvážili jeho zdieľanie so svojimi priateľmi, rodinou, spolupracovníkmi a komunitou.",
    "sl": "Izdaja tega glasila stane približno 50 dolarjev na dan. Zbrati moram čim več naročnikov, da bi ta projekt lahko vzdrževal brezplačno. Prosim vas, da razmislite o tem, da bi to delili svojim prijateljem, družini, sodelavcem in skupnosti.",
    "sv": "Att skapa detta nyhetsbrev kostar cirka 50 dollar per dag. Jag måste samla så många prenumeranter som möjligt för att kunna upprätthålla detta projekt gratis. Jag ber dig att överväga att dela detta med dina vänner, din familj, dina arbetskamrater och ditt samhälle.",
    "tr": "Bu bülteni oluşturmak günlük yaklaşık 50 dolara mal oluyor. Bu projeyi ücretsiz sürdürebilmek için mümkün olduğunca çok abone toplamam gerekiyor. Lütfen bunu arkadaşlarınızla, ailenizle, iş arkadaşlarınızla ve toplumunuzla paylaşmayı düşünmenizi rica ediyorum.",
    "uk": "Створення цієї розсилки коштує близько 50 доларів на день. Мені потрібно зібрати якомога більше підписників, щоб підтримувати цей проект безкоштовно. Я прошу вас, будь ласка, розглянути можливість поділитися цією інформацією з вашими друзями, родиною, колегами та спільнотою.",
    "zh": "产生这份通讯的费用大约是每天50美元。我需要收集尽可能多的订阅者来维持这个项目的免费。我恳请你考虑将其分享给你的朋友、家人、同事和社区。",
}

EMAIL_FOOTER = {
    "en": "How was today's newsletter? Let me know by filling out this [survey](https://airtable.com/shrty7OlhrLuBC6UX).",
    "bg": "Как беше днешният бюлетин? Споделете това с мен, като попълните тази [анкета](https://airtable.com/shrty7OlhrLuBC6UX).",
    "cs": "Jaký byl dnešní zpravodaj? Dejte mi vědět vyplněním tohoto [dotazníku](https://airtable.com/shrty7OlhrLuBC6UX).",
    "da": "Hvordan var dagens nyhedsbrev? Lad mig vide det ved at udfylde denne [undersøgelse] (https://airtable.com/shrty7OlhrLuBC6UX).",
    "de": "Wie war der heutige Newsletter? Lassen Sie es mich wissen, indem Sie diese [Umfrage](https://airtable.com/shrty7OlhrLuBC6UX) ausfüllen.",
    "el": "Πώς ήταν το σημερινό ενημερωτικό δελτίο; Ενημερώστε με συμπληρώνοντας αυτή την [έρευνα](https://airtable.com/shrty7OlhrLuBC6UX).",
    "es": "¿Qué tal el boletín de hoy? Házmelo saber rellenando esta [encuesta](https://airtable.com/shrty7OlhrLuBC6UX).",
    "et": "Kuidas oli tänane uudiskiri? Anna mulle teada, täites selle [küsitluse](https://airtable.com/shrty7OlhrLuBC6UX).",
    "fi": "Millainen oli tämänpäiväinen uutiskirje? Kerro minulle täyttämällä tämä [kysely](https://airtable.com/shrty7OlhrLuBC6UX).",
    "fr": "Comment s'est passée la lettre d'information d'aujourd'hui ? Faites-le moi savoir en remplissant cette [enquête] (https://airtable.com/shrty7OlhrLuBC6UX).",
    "hu": "Milyen volt a mai hírlevél? Tudassa velem, ha kitölti ezt a [felmérést](https://airtable.com/shrty7OlhrLuBC6UX).",
    "id": "Bagaimana buletin hari ini? Beri tahu saya dengan mengisi [survei] ini (https://airtable.com/shrty7OlhrLuBC6UX).",
    "it": "Com'era la newsletter di oggi? Fatemelo sapere compilando questo [sondaggio](https://airtable.com/shrty7OlhrLuBC6UX).",
    "ja": "本日のメルマガはいかがでしたでしょうか？この[アンケート](https://airtable.com/shrty7OlhrLuBC6UX)に答えて、教えてください。",
    "ko": "오늘 뉴스레터는 어땠나요? [설문조사](https://airtable.com/shrty7OlhrLuBC6UX)를 작성하여 알려주세요.",
    "lt": "Kaip sekėsi gauti šiandienos naujienlaiškį? Praneškite man apie tai užpildydami šią [apklausą] (https://airtable.com/shrty7OlhrLuBC6UX).",
    "lv": "Kā bija ar šodienas biļetenu? Dodiet man zināt, aizpildot šo [aptauju](https://airtable.com/shrty7OlhrLuBC6UX).",
    "nl": "Hoe was de nieuwsbrief van vandaag? Laat het me weten door deze [enquête] in te vullen (https://airtable.com/shrty7OlhrLuBC6UX).",
    "nb": "Hvordan var dagens nyhetsbrev? Gi meg beskjed ved å fylle ut denne [spørreundersøkelsen] (https://airtable.com/shrty7OlhrLuBC6UX).",
    "pl": "Jak wyglądał dzisiejszy newsletter? Daj mi znać wypełniając tę [ankietę](https://airtable.com/shrty7OlhrLuBC6UX).",
    "pt": "Como foi o boletim informativo de hoje? Avise-me preenchendo este [inquérito](https://airtable.com/shrty7OlhrLuBC6UX).",
    "ro": "Cum a fost buletinul informativ de astăzi? Spuneți-mi, completând acest [sondaj](https://airtable.com/shrty7OlhrLuBC6UX).",
    "ru": "Как вам сегодняшняя рассылка? Дайте мне знать, заполнив этот [опрос] (https://airtable.com/shrty7OlhrLuBC6UX).",
    "sk": "Aký bol dnešný bulletin? Dajte mi vedieť vyplnením tohto [dotazníka](https://airtable.com/shrty7OlhrLuBC6UX).",
    "sl": "Kako je bilo z današnjim glasilom? Povejte mi to tako, da izpolnite to [anketo](https://airtable.com/shrty7OlhrLuBC6UX).",
    "sv": "Hur var dagens nyhetsbrev? Låt mig veta det genom att fylla i denna [enkät] (https://airtable.com/shrty7OlhrLuBC6UX).",
    "tr": "Bugünkü bülten nasıldı? Bu [anketi] (https://airtable.com/shrty7OlhrLuBC6UX) doldurarak bana bildirin.",
    "uk": "Як вам сьогоднішня розсилка? Дайте мені знати, заповнивши це [опитування] (https://airtable.com/shrty7OlhrLuBC6UX).",
    "zh": "今天的通讯怎么样？请填写这个[调查](https://airtable.com/shrty7OlhrLuBC6UX)让我知道。",
}


def get_campaigns():
    """Get all campaigns"""
    return requests.get(server, auth=(username, password)).json()


def create_campaign(title, body, lang):
    """Create a new campaign"""
    utc = timezone("UTC")
    today = datetime.now().astimezone(utc).replace(hour=0, minute=0, second=0, microsecond=0)
    next_hour = datetime.now().astimezone(utc) + timedelta(minutes=CONFIG[lang] * 1 + 20)

    url = "https://hn.cho.sh/" + lang + "/" + today.strftime("%Y/%m/%d")

    md_link = f"""\n\n[hn.cho.sh/{lang}/{today.strftime('%Y/%m/%d')}]({url})\n\n"""

    prefix = EMAIL_CTA[lang] + md_link

    suffix = f"""\n\n---\n\n""" + EMAIL_FOOTER[lang] + md_link + "\n\n"

    res = requests.post(
        server,
        auth=(username, password),
        json={
            "name": title,
            "subject": title,
            "type": "regular",
            "content_type": "markdown",
            "body": prefix + body + suffix,
            "altbody": prefix + body + suffix,
            "lists": [CONFIG[lang]],
            "send_at": f"{today.strftime('%Y-%m-%d')}T{next_hour.strftime('%H:%M:%S')}+00:00",
        },
    ).json()
    try:
        requests.put(
            server + "/" + str(res["data"]["id"]) + "/status",
            auth=(username, password),
            json={"status": "scheduled"},
        )
    except Exception as e:
        print(e)
        print(res)
        print("failed to create campaign for " + lang)
        return False
    print("successfully created campaign for " + lang)
    return True


def find_today_newsletters(lang):
    """Find the newsletter for today in the Research folder. All UTC."""
    utc = timezone("UTC")
    today = datetime.now().astimezone(utc).replace(hour=0, minute=0, second=0, microsecond=0)
    filename = f"pages/{today.strftime('%Y/%m')}/{today.strftime('%d')}.{lang}.mdx"
    if os.path.exists(filename):
        with open(filename, "r") as f:
            post = frontmatter.load(f)
            title = (
                (post.metadata["top_news"] or format_date(today, format="long", locale=lang)) + " — hn.cho.sh/" + lang
            )
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
