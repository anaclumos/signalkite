const LINK_COPIED_TO_CLIPBOARD = {
  ar: 'رابط نسخ إلى الحافظة!',
  bn: 'ক্লিপবোর্ডে লিঙ্ক অনুলিপি করা হয়েছে!',
  cs: 'Odkaz zkopírovaný do schránky!',
  da: 'Link kopieret til udklipsholder!',
  de: 'Link in die Zwischenablage kopiert!',
  el: 'Σύνδεσμος αντιγράφεται στο Πρόχειρο!',
  en: 'Link Copied to Clipboard!',
  es: 'Enlace copiado al portapapeles',
  fi: 'Linkki kopioitu leikepöydälle!',
  fr: 'Lien copié dans le presse-papiers !',
  he: 'הקישור הועתק ללוח!',
  hi: 'क्लिपबोर्ड पर कॉपी की गई लिंक!',
  hu: 'Link másolva a vágólapra!',
  id: 'Tautan Disalin ke Clipboard!',
  it: 'Link copiato negli appunti!',
  ja: 'クリップボードにコピーされたリンク',
  ko: '링크가 클립보드에 복사되었습니다!',
  nb: 'Lenke kopiert til utklippstavlen!',
  nl: 'Link gekopieerd naar klembord!',
  pl: 'Link skopiowany do schowka!',
  pt: 'Link copiado para a área de transferência!',
  ro: 'Link copiat în clipboard!',
  ru: 'Ссылка скопирована в буфер обмена!',
  sk: 'Odkaz skopírovaný do schránky!',
  sv: 'Länk kopierad till urklipp!',
  ta: 'கிளிப்போர்டுக்கு நகலெடுக்கப்பட்ட இணைப்பு!',
  th: 'ลิงค์คัดลอกไปยังคลิปบอร์ด!',
  tr: 'Bağlantı Panoya Kopyalandı!',
  'zh-Hans': '链接复制到剪贴板',
  'zh-Hant': '連結已複製到剪貼簿！',
}

export const useShare = async (locale: string = 'en') => {
  if (typeof window === 'undefined') return null
  const urlParams = new URLSearchParams(window.location.search)
  const query = urlParams.get('share')
  if (query === 'true') {
    if (navigator.share) {
      navigator
        .share({
          url: window.location.href,
        })
        .catch((error) => {
          console.log('Error sharing', error)
        })
    } else {
      navigator.clipboard.writeText(window.location.href.split('?')[0] + '?ref=share').then(() => {
        alert(LINK_COPIED_TO_CLIPBOARD[locale])
      })
    }
  }
}
