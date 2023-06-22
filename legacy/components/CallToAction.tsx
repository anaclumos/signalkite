import React from 'react'

import Link from 'next/link'
import { useRouter } from 'next/router'
import { Cards } from 'nextra-theme-docs'

const i18n = {
  copiedToClipboard: {
    en: 'Copied to Clipboard!',
    bg: 'Копирано в клипборда!',
    cs: 'Zkopírováno do schránky!',
    da: 'Kopieret til udklipsholder!',
    de: 'In die Zwischenablage kopiert!',
    el: 'Αντιγραφή στο Πρόχειρο!',
    es: 'Copiado al portapapeles',
    et: 'Kopeeritud lõikelauale!',
    fi: 'Kopioitu leikepöydälle!',
    fr: 'Copié dans le presse-papiers !',
    hu: 'A vágólapra másolva!',
    id: 'Disalin ke Clipboard!',
    it: 'Copiato negli Appunti!',
    ja: 'クリップボードにコピーされます！',
    ko: '클립보드에 복사했습니다!',
    lt: 'Nukopijuota į iškarpinę!',
    lv: 'Kopēts uz starpliktuvi!',
    nl: 'Gekopieerd naar Klembord!',
    nb: 'Kopiert til utklippstavlen!',
    pl: 'Skopiowane do schowka!',
    pt: 'Copiado para o Clipboard!',
    ro: 'Copiat în clipboard!',
    ru: 'Скопировано в буфер обмена!',
    sk: 'Skopírované do schránky!',
    sl: 'Kopirano v odložišče!',
    sv: 'Kopieras till Urklipp!',
    tr: 'Panoya kopyalandı!',
    uk: 'Скопійовано до буфера обміну!',
    zh: '复制到剪贴板上了!',
  },
  failedToCopy: {
    en: 'Failed to copy!',
    bg: 'Неуспешно копиране!',
    cs: 'Nepodařilo se zkopírovat!',
    da: 'Kopiering mislykkedes!',
    de: 'Kopie fehlgeschlagen!',
    el: 'Απέτυχε η αντιγραφή!',
    es: 'No se ha podido copiar.',
    et: 'Ei õnnestunud kopeerida!',
    fi: 'Kopiointi epäonnistui!',
    fr: 'La copie a échoué !',
    hu: 'Nem sikerült a másolás!',
    id: 'Gagal menyalin!',
    it: 'Copia non riuscita!',
    ja: 'コピーに失敗しました！',
    ko: '복사하지 못했습니다!',
    lt: 'Nepavyko nukopijuoti!',
    lv: 'Neizdevās kopēt!',
    nl: 'Niet gekopieerd!',
    nb: 'Kunne ikke kopiere!',
    pl: 'Nie udało się skopiować!',
    pt: 'Falha na cópia!',
    ro: 'Nu a reușit să copieze!',
    ru: 'Не удалось скопировать!',
    sk: 'Nepodarilo sa skopírovať!',
    sl: 'Ni uspelo kopirati!',
    sv: 'Kopieringen misslyckades!',
    tr: 'Kopyalanamadı!',
    uk: 'Не вдалося скопіювати!',
    zh: '复制失败!',
  },
  share: {
    en: 'Share',
    bg: 'Споделете',
    cs: 'Sdílet',
    da: 'Del',
    de: 'Teilen Sie',
    el: 'Μοιραστείτε το',
    es: 'Compartir',
    et: 'Jaga',
    fi: 'Jaa',
    fr: 'Partager',
    hu: 'Megosztás',
    id: 'Bagikan',
    it: 'Condividi',
    ja: 'シェア',
    ko: '공유',
    lt: 'Dalintis',
    lv: 'Dalīties',
    nl: 'Deel',
    nb: 'Del',
    pl: 'Podziel się',
    pt: 'Partilhar',
    ro: 'Share',
    ru: 'Поделиться',
    sk: 'Zdieľať',
    sl: 'Delite',
    sv: 'Dela',
    tr: 'Paylaş',
    uk: 'Поділіться',
    zh: '分享',
  },
  subscribe: {
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
}

const share = (language) => {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href,
    })
  } else {
    const copyContent = async () => {
      const text = window.location.href
      try {
        await navigator.clipboard.writeText(text)
        alert(i18n.copiedToClipboard[language])
      } catch (err) {
        console.error(i18n.failedToCopy[language], err)
      }
    }
    copyContent()
  }
}

const CallToAction = () => {
  const router = useRouter()
  const language = router.locale || 'en'
  return (
    <Cards>
      <div
        onClick={() => share(language)}
        className="nextra-card nx-group nx-flex nx-flex-col nx-justify-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200 nx-text-current nx-no-underline dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900 nx-cursor-pointer"
      >
        <span className="nx-flex nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900 dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
            ></path>
          </svg>
          {i18n.share[language]}
        </span>
      </div>

      <Link
        className="nextra-card nx-group nx-flex nx-flex-col nx-justify-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200 nx-text-current nx-no-underline dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900"
        href="/subscribe"
      >
        <span className="nx-flex nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900 dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
            ></path>
          </svg>
          {i18n.subscribe[language]}
        </span>
      </Link>
    </Cards>
  )
}

export default CallToAction
