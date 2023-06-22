import React from 'react'

import { useRouter } from 'next/router'
import { Cards, Steps } from 'nextra-theme-docs'

const i18n = {
  subscribeHeader: {
    en: 'Subscribe',
    bg: 'Абонирайте се за',
    cs: 'Přihlaste se k odběru na',
    da: 'Tilmeld dig',
    de: 'Abonnieren',
    el: 'Εγγραφείτε στο',
    es: 'Suscríbase a',
    et: 'Telli',
    fi: 'Tilaa',
    fr: "S'abonner",
    hu: 'Feliratkozás',
    id: 'Berlangganan',
    it: 'Abbonarsi',
    ja: 'サブスクライブ',
    ko: '구독',
    lt: 'Prenumeruoti',
    lv: 'Abonēt',
    nl: 'Inschrijven',
    nb: 'Abonner',
    pl: 'Subskrybuj',
    pt: 'Subscrever',
    ro: 'Abonează-te la',
    ru: 'Подписаться',
    sk: 'Prihlásiť sa na',
    sl: 'Naročite se na',
    sv: 'Prenumerera på',
    tr: 'Abone Olun',
    uk: 'Підписатися',
    zh: '订阅',
  },
  emailQuestion: {
    en: 'First, may I have your email address?',
    bg: 'Първо, може ли да ми дадете имейл адреса си?',
    cs: 'Nejdříve mi dejte svou e-mailovou adresu.',
    da: 'Må jeg først få din e-mailadresse?',
    de: 'Darf ich zunächst Ihre E-Mail-Adresse haben?',
    el: 'Πρώτον, μπορώ να έχω τη διεύθυνση ηλεκτρονικού ταχυδρομείου σας;',
    es: 'En primer lugar, ¿podría darme su dirección de correo electrónico?',
    et: 'Esiteks, kas ma võin saada teie e-posti aadressi?',
    fi: 'Saanko ensinnäkin sähköpostiosoitteenne?',
    fr: "Tout d'abord, puis-je avoir votre adresse électronique ?",
    hu: 'Először is, megkaphatnám az e-mail címét?',
    id: 'Pertama, bolehkah saya meminta alamat email Anda?',
    it: 'Innanzitutto, posso avere il suo indirizzo e-mail?',
    ja: 'まず、メールアドレスを教えてもらってもいいですか？',
    ko: '먼저 이메일 주소를 알려주시겠어요?',
    lt: 'Pirma, ar galiu gauti jūsų el. pašto adresą?',
    lv: 'Pirmkārt, vai varu saņemt jūsu e-pasta adresi?',
    nl: 'Ten eerste, mag ik uw e-mailadres?',
    nb: 'Kan jeg først få e-postadressen din?',
    pl: 'Po pierwsze, czy mogę dostać twój adres e-mail?',
    pt: 'Primeiro, podem dar-me o vosso endereço de correio electrónico?',
    ro: 'În primul rând, îmi puteți da adresa dumneavoastră de e-mail?',
    ru: 'Во-первых, могу ли я получить ваш адрес электронной почты?',
    sk: 'Najprv mi dajte svoju e-mailovú adresu.',
    sl: 'Najprej, ali lahko dobim vaš e-poštni naslov?',
    sv: 'För det första, kan jag få din e-postadress?',
    tr: 'Öncelikle, e-posta adresinizi alabilir miyim?',
    uk: 'По-перше, чи можу я отримати вашу електронну адресу?',
    zh: '首先，我可以知道你的电子邮件地址吗？',
  },
  languageQuestion: {
    en: 'Next, what languages do you speak?',
    bg: 'След това, какви езици говорите?',
    cs: 'Dále, jakými jazyky mluvíte?',
    da: 'Hvilke sprog taler du dernæst?',
    de: 'Nächste Frage: Welche Sprachen sprechen Sie?',
    el: 'Στη συνέχεια, ποιες γλώσσες μιλάτε;',
    es: 'A continuación, ¿qué idiomas habla?',
    et: 'Järgmiseks, milliseid keeli te räägite?',
    fi: 'Seuraavaksi, mitä kieliä puhutte?',
    fr: 'Ensuite, quelles langues parlez-vous ?',
    hu: 'Következő, milyen nyelveket beszélsz?',
    id: 'Selanjutnya, bahasa apa yang Anda kuasai?',
    it: 'Poi, quali lingue parlate?',
    ja: '次に、どんな言語が話せるか。',
    ko: '다음으로, 어떤 언어를 사용하시나요?',
    lt: 'Kitas klausimas: kokias kalbas mokate?',
    lv: 'Tālāk, kādās valodās jūs runājat?',
    nl: 'Vervolgens, welke talen spreek je?',
    nb: 'Hvilke språk snakker du?',
    pl: 'Dalej, jakimi językami się posługujesz?',
    pt: 'A seguir, que línguas fala?',
    ro: 'Apoi, ce limbi vorbiți?',
    ru: 'Далее, какими языками вы владеете?',
    sk: 'Ďalej, akými jazykmi hovoríte?',
    sl: 'Nato, katere jezike govorite?',
    sv: 'Vilka språk talar du sedan?',
    tr: 'Sonra, hangi dilleri konuşuyorsunuz?',
    uk: 'Далі, якими мовами ви володієте?',
    zh: '接下来，你会说什么语言？',
  },
  languageQuestionDescription: {
    en: 'You can select multiple languages, but be careful not to select too many. Your inbox will then look horrible.',
    bg: 'Можете да изберете няколко езика, но внимавайте да не изберете твърде много. Тогава входящата ви поща ще изглежда ужасно.',
    cs: 'Můžete vybrat více jazyků, ale dejte pozor, abyste jich nevybrali příliš mnoho. Vaše doručená pošta pak bude vypadat příšerně.',
    da: 'Du kan vælge flere sprog, men pas på, at du ikke vælger for mange. Så vil din indbakke se forfærdelig ud.',
    de: 'Sie können mehrere Sprachen auswählen, aber achten Sie darauf, dass Sie nicht zu viele auswählen. Ihr Posteingang sieht dann furchtbar aus.',
    el: 'Μπορείτε να επιλέξετε πολλές γλώσσες, αλλά προσέξτε να μην επιλέξετε πολλές. Τα εισερχόμενά σας θα φαίνονται απαίσια.',
    es: 'Puedes seleccionar varios idiomas, pero ten cuidado de no seleccionar demasiados. Tu bandeja de entrada tendrá entonces un aspecto horrible.',
    et: 'Saate valida mitu keelt, kuid olge ettevaatlik, et mitte valida liiga palju. Teie postkast näeb siis kohutav välja.',
    fi: 'Voit valita useita kieliä, mutta varo valitsemasta liikaa. Postilaatikkosi näyttää silloin kamalalta.',
    fr: 'Vous pouvez sélectionner plusieurs langues, mais veillez à ne pas en sélectionner trop. Votre boîte de réception aurait alors un aspect horrible.',
    hu: 'Több nyelvet is kiválaszthat, de vigyázzon, hogy ne válasszon túl sokat. A bejövő üzenete akkor borzalmasan fog kinézni.',
    id: 'Anda dapat memilih beberapa bahasa, tetapi berhati-hatilah untuk tidak memilih terlalu banyak. Kotak masuk Anda akan terlihat mengerikan.',
    it: 'È possibile selezionare più lingue, ma bisogna fare attenzione a non selezionarne troppe. La casella di posta elettronica avrà un aspetto orribile.',
    ja: '複数の言語を選択することができますが、選択し過ぎないように注意してください。そうすると、受信トレイがひどいことになります。',
    ko: '여러 언어를 선택할 수 있지만 너무 많은 언어를 선택하지 않도록 주의하세요. 자칫하면 받은 편지함이 끔찍하게 보일테니까요.',
    lt: 'Galite pasirinkti kelias kalbas, tačiau būkite atsargūs ir nepasirinkite jų per daug. Tuomet jūsų pašto dėžutė atrodys siaubingai.',
    lv: 'Varat atlasīt vairākas valodas, taču esiet uzmanīgi, lai to nebūtu pārāk daudz. Tad jūsu ienākošā vēstuļu kastīte izskatīsies briesmīgi.',
    nl: 'U kunt meerdere talen selecteren, maar pas op dat u er niet te veel selecteert. Uw inbox ziet er dan verschrikkelijk uit.',
    nb: 'Du kan velge flere språk, men vær forsiktig så du ikke velger for mange. Innboksen din vil da se forferdelig ut.',
    pl: 'Możesz wybrać wiele języków, ale uważaj, aby nie wybrać ich zbyt wiele. Twoja skrzynka odbiorcza będzie wtedy wyglądać okropnie.',
    pt: 'Pode seleccionar várias línguas, mas tenha cuidado para não seleccionar demasiadas. A sua caixa de entrada terá então um aspecto horrível.',
    ro: 'Puteți selecta mai multe limbi, dar aveți grijă să nu selectați prea multe. Cutia dvs. poștală de primire va arăta atunci oribil.',
    ru: 'Вы можете выбрать несколько языков, но будьте осторожны, чтобы не выбрать слишком много языков. В этом случае ваш почтовый ящик будет выглядеть ужасно.',
    sk: 'Môžete vybrať viacero jazykov, ale dávajte pozor, aby ste ich nevybrali príliš veľa. Vaša doručená pošta potom bude vyzerať hrozne.',
    sl: 'Izberete lahko več jezikov, vendar pazite, da jih ne izberete preveč. Potem bo vaš poštni predal videti grozno.',
    sv: 'Du kan välja flera språk, men var försiktig så att du inte väljer för många. Din inkorg kommer då att se hemsk ut.',
    tr: 'Birden fazla dil seçebilirsiniz, ancak çok fazla dil seçmemeye dikkat edin. Gelen kutunuz o zaman korkunç görünecektir.',
    uk: 'Ви можете вибрати кілька мов, але будьте обережні, щоб не вибрати занадто багато. Тоді ваша поштова скринька буде виглядати жахливо.',
    zh: '你可以选择多种语言，但要注意不要选择太多。这样你的收件箱就会看起来很糟糕。',
  },
  personalNewsletterQuestion: {
    en: "Would you mind receiving updates on what I'm working on?",
    bg: 'Имате ли нещо против да получавате новини за това, върху което работя?',
    cs: 'Vadilo by vám, kdybyste dostávali aktuální informace o tom, na čem pracuji?',
    da: 'Vil du have noget imod at modtage opdateringer om det, jeg arbejder på?',
    de: 'Hätten Sie etwas dagegen, wenn ich Ihnen mitteile, woran ich arbeite?',
    el: 'Θα σας πείραζε να λαμβάνετε ενημερώσεις για το τι δουλεύω;',
    es: '¿Le importaría recibir información actualizada sobre lo que estoy haciendo?',
    et: 'Kas teid häiriks, kui saaksite teavet selle kohta, millega ma töötan?',
    fi: 'Voisitteko saada päivityksiä siitä, mitä työstän?',
    fr: 'Souhaitez-vous être tenu au courant de mes travaux ?',
    hu: 'Nem bánná, ha kapna frissítéseket arról, hogy min dolgozom?',
    id: 'Maukah Anda menerima pembaruan tentang apa yang sedang saya kerjakan?',
    it: 'Le dispiacerebbe ricevere aggiornamenti su ciò a cui sto lavorando?',
    ja: '私が取り組んでいることの最新情報を受け取っていただけませんか？',
    ko: '제가 진행 중인 다양한 작업에 대한 글을 받아보시겠어요?',
    lt: 'Ar norėtumėte gauti naujienas apie tai, ką dirbu?',
    lv: 'Vai jūs varētu saņemt jaunāko informāciju par to, pie kā es strādāju?',
    nl: 'Zou je het erg vinden om updates te ontvangen over waar ik aan werk?',
    nb: 'Vil du motta oppdateringer om hva jeg jobber med?',
    pl: 'Czy chciałbyś otrzymywać aktualizacje na temat tego, nad czym pracuję?',
    pt: 'Importa-se de receber actualizações sobre aquilo em que estou a trabalhar?',
    ro: 'Te-ar deranja să primești noutăți despre ceea ce lucrez?',
    ru: 'Не хотели бы вы получать обновления о том, над чем я работаю?',
    sk: 'Mohli by ste dostávať aktuálne informácie o tom, na čom pracujem?',
    sl: 'Bi vas motilo prejemanje posodobitev o tem, kaj delam?',
    sv: 'Skulle du ha något emot att få uppdateringar om vad jag arbetar med?',
    tr: 'Üzerinde çalıştığım şeylerle ilgili güncellemeleri almak ister misiniz?',
    uk: 'Чи хотіли б ви отримувати оновлення про те, над чим я працюю?',
    zh: '你是否介意收到我工作的最新情况？',
  },
  personalNewsletterQuestionDescription: {
    en: "You don't need to select anything here, but I do send something extraordinary ;)",
    bg: 'Не е необходимо да избирате нищо тук, но аз изпращам нещо необикновено ;)',
    cs: 'Nemusíte zde nic vybírat, ale posílám něco mimořádného ;)',
    da: 'Du behøver ikke at vælge noget her, men jeg sender noget ekstraordinært ;)',
    de: 'Du brauchst hier nichts auszuwählen, aber ich schicke etwas Außergewöhnliches ;)',
    el: 'Δεν χρειάζεται να επιλέξετε κάτι εδώ, αλλά στέλνω κάτι εξαιρετικό ;)',
    es: 'No es necesario que seleccione nada aquí, pero sí que envíe algo extraordinario ;)',
    et: 'Sa ei pea siin midagi valima, aga ma saadan midagi erakordset ;)',
    fi: 'Sinun ei tarvitse valita mitään, mutta lähetän jotain erikoista ;)',
    fr: "Vous n'avez pas besoin de sélectionner quoi que ce soit ici, mais j'envoie quelque chose d'extraordinaire ;)",
    hu: 'Itt nem kell választani semmit, de küldök valami rendkívüli dolgot ;)',
    id: 'Anda tidak perlu memilih apa pun di sini, tetapi saya mengirimkan sesuatu yang luar biasa;)',
    it: 'Non è necessario selezionare nulla qui, ma invio qualcosa di straordinario ;)',
    ja: 'ここでは何も選択する必要はありませんが、私は特別なものを送ります ;)',
    ko: '꼭 선택하실 필요는 없지만, 특별한 것을 보내드릴게요 ;)',
    lt: 'Čia nieko nereikia rinktis, bet aš siunčiu ką nors nepaprasto ;)',
    lv: 'Tev šeit nekas nav jāizvēlas, bet es sūtu kaut ko neparastu ;)',
    nl: 'Je hoeft hier niets te selecteren, maar ik stuur wel iets bijzonders ;)',
    nb: 'Du trenger ikke å velge noe her, men jeg sender noe ekstraordinært ;)',
    pl: 'Nie musicie tu nic wybierać, ale ja wysyłam coś nietuzinkowego ;)',
    pt: 'Não precisa de seleccionar nada aqui, mas eu envio algo extraordinário ;)',
    ro: 'Nu trebuie să selectezi nimic aici, dar trimit ceva extraordinar ;)',
    ru: 'Вам не нужно ничего выбирать, но я посылаю что-то необычное ;)',
    sk: 'Nemusíte tu nič vyberať, ale posielam niečo výnimočné ;)',
    sl: 'Tukaj vam ni treba izbrati ničesar, vendar vam pošljem nekaj izjemnega ;)',
    sv: 'Du behöver inte välja något här, men jag skickar gärna något extraordinärt ;)',
    tr: 'Burada bir şey seçmenize gerek yok, ancak olağanüstü bir şey gönderiyorum ;)',
    uk: 'Вам не потрібно нічого обирати, але я відправляю дещо незвичайне ;)',
    zh: '你不需要在这里选择任何东西，但我确实送了一些非凡的东西;)',
  },
  submitHeader: {
    en: 'Now, Submit!',
    bg: 'А сега изпратете!',
    cs: 'Nyní odešlete!',
    da: 'Nu skal du indsende!',
    de: 'Jetzt einreichen!',
    el: 'Τώρα, υποβάλετε!',
    es: 'Ahora, ¡someta!',
    et: 'Nüüd, esitage!',
    fi: 'Nyt, lähetä!',
    fr: 'Maintenant, soumettez !',
    hu: 'Most pedig küldje be!',
    id: 'Sekarang, Kirim!',
    it: 'Ora, inviate!',
    ja: 'では、Submit！',
    ko: '이제 제출하세요!',
    lt: 'Dabar pateikite!',
    lv: 'Tagad iesniedziet!',
    nl: 'Nu, indienen!',
    nb: 'Nå, send inn!',
    pl: 'A teraz zgłaszajcie się!',
    pt: 'Agora, submete-te!',
    ro: 'Acum, trimiteți!',
    ru: 'Теперь подавайте!',
    sk: 'Teraz odošlite!',
    sl: 'Zdaj oddajte!',
    sv: 'Skicka in nu!',
    tr: 'Şimdi, Gönder!',
    uk: 'А тепер, підкоряйся!',
    zh: '现在，提交!',
  },
  submitButton: {
    en: 'Submit',
    bg: 'Подаване на',
    cs: 'Odeslat',
    da: 'Indsend',
    de: 'Einreichen',
    el: 'Υποβολή',
    es: 'Enviar',
    et: 'Esita',
    fi: 'Lähetä',
    fr: 'Soumettre',
    hu: 'Küldje be a',
    id: 'Kirim',
    it: 'Invia',
    ja: '送信',
    ko: '제출',
    lt: 'Pateikti',
    lv: 'Iesniegt',
    nl: 'Dien  in',
    nb: 'Send inn',
    pl: 'Zgłoś',
    pt: 'Submeter',
    ro: 'Trimiteți',
    ru: 'Отправить',
    sk: 'Odoslať',
    sl: 'Pošlji',
    sv: 'Skicka in',
    tr: 'Gönder',
    uk: 'Надіслати',
    zh: '提交',
  },
  askForLanguage: {
    en: 'Please select at least one language!',
    bg: 'Моля, изберете поне един език!',
    cs: 'Vyberte prosím alespoň jeden jazyk!',
    da: 'Vælg mindst ét sprog!',
    de: 'Bitte wählen Sie mindestens eine Sprache aus!',
    el: 'Παρακαλούμε επιλέξτε τουλάχιστον μία γλώσσα!',
    es: 'Seleccione al menos un idioma.',
    et: 'Palun valige vähemalt üks keel!',
    fi: 'Valitse vähintään yksi kieli!',
    fr: 'Veuillez sélectionner au moins une langue !',
    hu: 'Kérjük, válasszon legalább egy nyelvet!',
    id: 'Silakan pilih setidaknya satu bahasa!',
    it: 'Selezionare almeno una lingua!',
    ja: '少なくとも1つの言語を選択してください！',
    ko: '언어를 하나 이상 선택해 주세요!',
    lt: 'Pasirinkite bent vieną kalbą!',
    lv: 'Lūdzu, izvēlieties vismaz vienu valodu!',
    nl: 'Selecteer ten minste één taal!',
    nb: 'Vennligst velg minst ett språk!',
    pl: 'Proszę wybrać przynajmniej jeden język!',
    pt: 'Por favor, seleccione pelo menos uma língua!',
    ro: 'Vă rugăm să selectați cel puțin o limbă!',
    ru: 'Пожалуйста, выберите хотя бы один язык!',
    sk: 'Vyberte aspoň jeden jazyk!',
    sl: 'Izberite vsaj en jezik!',
    sv: 'Välj minst ett språk!',
    tr: 'Lütfen en az bir dil seçin!',
    uk: 'Будь ласка, оберіть принаймні одну мову!',
    zh: '请至少选择一种语言!',
  },
}

const onSubmit = (e, language) => {
  if (e) e.preventDefault()
  const email = (document.getElementById('email') as HTMLInputElement).value
  const languages = Array.from(
    document.querySelectorAll('input[name="l"]:checked')
  ).map((el: HTMLInputElement) => el.value)
  if (!email) {
    document.getElementById('email').focus()
    return false
  }
  if (!languages.length) {
    const y =
      document.getElementById('language').getBoundingClientRect().top +
      window.pageYOffset -
      300
    window.scrollTo({ top: y, behavior: 'smooth' })
    alert(i18n.askForLanguage[language])
    return false
  }
  if (email && languages.length) {
    ;(document.getElementById('subscribe-form') as HTMLFormElement).submit()
    return true
  }
}

const Subscribe = () => {
  const router = useRouter()
  const language = router.locale || 'en'
  return (
    <form
      method="post"
      action="https://newsletters.cho.sh/subscription/form"
      id="subscribe-form"
    >
      <Steps>
        <h2 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-mt-10 nx-border-b nx-pb-1 nx-text-3xl nx-border-neutral-200/70 contrast-more:nx-border-neutral-400 dark:nx-border-primary-100/10 contrast-more:dark:nx-border-neutral-400">
          {i18n.subscribeHeader[language]}
        </h2>
        <h3 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-mt-8 nx-mb-8 nx-text-2xl">
          {i18n.emailQuestion[language]}
        </h3>
        <input
          type="email"
          name="email"
          id="email"
          required
          placeholder="elon@twitter.com"
          className="nextra-callout nx-overflow-x-auto nx-w-full nx-m-2 nx-flex nx-rounded-lg nx-border nx-p-4 ltr:nx-pr-4 rtl:nx-pl-4 contrast-more:nx-border-current contrast-more:dark:nx-border-current nx-border-gray-200 nx-text-current nx-no-underline dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900 language-card peer-checked:border-gray-900"
        />
        <h3 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-mt-8 nx-text-2xl">
          {i18n.languageQuestion[language]}
        </h3>
        <p className="nx-text-gray-700 dark:nx-text-neutral-500 nx-mt-2">
          {i18n.languageQuestionDescription[language]}
        </p>
        <Cards id="language">
          {[
            ['български (bg)', 'b883b', 'b883b09e-f87f-49d7-90a5-12e3cf35ba88'],
            ['Čeština (cs)', '306f0', '306f0b81-393a-44ac-a5c3-ecbb0e9418be'],
            ['Dansk (da)', 'b0348', 'b034802b-cedc-480e-8eed-987a4d8d1da2'],
            ['Deutsch (de)', '52954', '52954b4c-618f-47a1-aede-db215fe34224'],
            ['Ελληνικά (el)', 'f6b4d', 'f6b4d6f2-5153-44dd-9218-eabba3d11b6c'],
            ['English (en)', '4ecc0', '4ecc0fef-6f96-40ca-8fb5-6d13a2a836fc'],
            ['Espanya (es)', '5f59e', '5f59ec4d-f60d-47f8-b696-35454037a700'],
            ['Eesti (et)', '1d76a', '1d76af3c-7ea0-4731-82f2-16bcc7a6e73e'],
            ['Suomi (fi)', 'd473a', 'd473a1b5-8d98-4e99-b0e6-798893f07e72'],
            ['Français (fr)', 'd5c07', 'd5c075a9-5857-4def-bf87-574571c41ddf'],
            ['Magyar (hu)', 'd0a87', 'd0a873f8-e26a-4fb2-8c2f-4a6a7da231b7'],
            [
              'Bahasa Indonesia (id)',
              '65116',
              '65116af5-a8f8-4a48-9e84-5743818c1138',
            ],
            ['Italiano (it)', 'b2c1f', 'b2c1f107-f278-4fe9-b311-6b0f16ada56a'],
            ['日本語 (ja)', 'f3087', 'f3087ae3-fc01-4bf0-8ddb-b837991d815d'],
            ['한국어 (ko)', '61d50', '61d50954-def8-4e11-8c7d-619e3ad61750'],
            ['Lietuvių (lt)', '81b93', '81b93cc7-8d0a-4c97-9e92-0cc10d05080e'],
            ['Latviešu (lv)', 'fc7b0', 'fc7b0d46-24be-48fd-9cac-e9103d2b0a13'],
            ['Bokmål (nb)', 'e8dd3', 'e8dd3929-646d-41f9-999e-c1f24a5e2950'],
            [
              'Nederlands (nl)',
              'b0ab7',
              'b0ab7199-158a-409b-b5ea-fe8442a9bb6c',
            ],
            ['Polski (pl)', '4332f', '4332f47d-0ebb-405c-82c8-9ee7ca3288f9'],
            ['Português (pt)', 'ff5bd', 'ff5bd42d-2202-4dc1-9d56-f331ea3de4f1'],
            ['Română (ro)', 'bdb1a', 'bdb1af01-4117-4647-a45c-016dc6e8d231'],
            ['Русский (ru)', '43559', '43559490-cc7e-4931-b456-974f27737f27'],
            [
              'Slovenčina (sk)',
              'be766',
              'be76696b-119f-468a-b5ce-861c7c60f244',
            ],
            [
              'Slovenščina (sl)',
              '3d77b',
              '3d77b1b6-9204-435f-8855-f60a7943c69c',
            ],
            ['Svenska (sv)', '55c70', '55c70ef2-a0b9-4689-9331-66e9b2166813'],
            ['Türkçe (tr)', '2120b', '2120be4a-dc37-4520-992a-ad78e1017a8c'],
            [
              'Українська (uk)',
              '1a923',
              '1a9237b8-2ada-43d7-8b7d-da9d54530212',
            ],
            ['中文 (zh)', '61502', '6150256a-eced-4e91-adf8-4504c176e673'],
          ].map(([text, id, value]) => (
            <label
              key={id}
              className="nextra-card nx-group nx-flex nx-items-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200 nx-text-current nx-no-underline dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900 language-card nx-cursor-pointer peer-checked:border-gray-900"
              htmlFor={id}
            >
              <input
                id={id}
                type="checkbox"
                name="l"
                value={value}
                className="nx-peer nx-sr-only"
              />
              <span className="nx-flex nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900 dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50 peer-checked:nx-text-gray-900">
                {text}
              </span>
            </label>
          ))}
        </Cards>

        <h3 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-mt-8 nx-text-2xl">
          {i18n.personalNewsletterQuestion[language]}
        </h3>
        <p className="nx-text-gray-700 dark:nx-text-neutral-500 nx-mt-2">
          {i18n.personalNewsletterQuestionDescription[language]}
        </p>
        <Cards>
          {[
            [
              'Yes, in English!',
              '5ebfb',
              '5ebfb430-82b5-47b8-b74b-c7b7d17bb97b',
            ],
            [
              '네, 한국어로요!',
              'ed372',
              'ed372c11-9f49-4d41-aecf-d8893bf48996',
            ],
          ].map(([text, id, value]) => (
            <label
              key={id}
              className="nextra-card nx-group nx-flex nx-items-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200 nx-text-current nx-no-underline dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900 language-card nx-cursor-pointer peer-checked:border-gray-900"
              htmlFor={id}
            >
              <input
                id={id}
                type="checkbox"
                name="l"
                value={value}
                className="nx-peer nx-sr-only"
              />
              <span className="nx-flex nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900 dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50 peer-checked:nx-text-gray-900">
                {text}
              </span>
            </label>
          ))}
        </Cards>
        <h3 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-mt-8 nx-text-2xl">
          {i18n.submitHeader[language]}
        </h3>
        <button
          className="nx-w-full nx-py-4 nx-px-4 nx-my-4 nx-border nx-border-gray-200 nx-rounded-lg nx-bg-blue-500 nx-text-white nx-font-semibold nx-text-md hover:nx-bg-blue-600 focus:nx-outline-none focus:nx-ring-4 focus:nx-ring-blue-300 active:nx-bg-blue-700 nx-duration-150 dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900 transition ease-in-out"
          id="submit-button"
          onClick={(e) => {
            onSubmit(e, language)
          }}
        >
          {i18n.submitButton[language]}
        </button>
      </Steps>
    </form>
  )
}

export default Subscribe
