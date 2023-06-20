import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import af from './locales/af.json' // Afrikaans, Provided By Bing
import ak from './locales/ak.json' // Twi (Akan), Provided By Google
import am from './locales/am.json' // Amharic, Provided By Bing
import ar from './locales/ar.json' // Arabic, Provided By Bing
import as from './locales/as.json' // Assamese, Provided By Bing
import ay from './locales/ay.json' // Aymara, Provided By Google
import az from './locales/az.json' // Azerbaijani, Provided By Bing
import ba from './locales/ba.json' // Bashkir, Provided By Bing
import be from './locales/be.json' // Belarusian, Provided By Google
import bg from './locales/bg.json' // Bulgarian, Provided By DeepL
import bho from './locales/bho.json' // Bhojpuri, Provided By Google
import bm from './locales/bm.json' // Bambara, Provided By Google
import bn from './locales/bn.json' // Bengali, Provided By Bing
import bo from './locales/bo.json' // Tibetan, Provided By Bing
import bs from './locales/bs.json' // Bosnian, Provided By Bing
import ca from './locales/ca.json' // Catalan, Provided By Bing
import ceb from './locales/ceb.json' // Cebuano, Provided By Google
import ckb from './locales/ckb.json' // Kurdish (Sorani), Provided By Google
import co from './locales/co.json' // Corsican, Provided By Google
import cs from './locales/cs.json' // Czech, Provided By DeepL
import cy from './locales/cy.json' // Welsh, Provided By Bing
import da from './locales/da.json' // Danish, Provided By DeepL
import de from './locales/de.json' // German, Provided By DeepL
import doi from './locales/doi.json' // Dogri, Provided By Google
import dv from './locales/dv.json' // Dhivehi, Provided By Bing
import ee from './locales/ee.json' // Ewe, Provided By Google
import el from './locales/el.json' // Greek, Provided By DeepL
import en from './locales/en.json' // English, Provided By DeepL
import eo from './locales/eo.json' // Esperanto, Provided By Google
import es from './locales/es.json' // Spanish, Provided By DeepL
import et from './locales/et.json' // Estonian, Provided By DeepL
import eu from './locales/eu.json' // Basque, Provided By Bing
import fa from './locales/fa.json' // Persian, Provided By Bing
import fi from './locales/fi.json' // Finnish, Provided By DeepL
import fil from './locales/fil.json' // Filipino (Tagalog), Provided By Bing
import fj from './locales/fj.json' // Fijian, Provided By Bing
import fo from './locales/fo.json' // Faroese, Provided By Bing
import fr from './locales/fr.json' // French, Provided By DeepL
import fy from './locales/fy.json' // Frisian, Provided By Google
import ga from './locales/ga.json' // Irish, Provided By Bing
import gd from './locales/gd.json' // Scots Gaelic, Provided By Google
import gl from './locales/gl.json' // Galician, Provided By Bing
import gn from './locales/gn.json' // Guarani, Provided By Google
import gom from './locales/gom.json' // Konkani, Provided By Google
import gu from './locales/gu.json' // Gujarati, Provided By Bing
import ha from './locales/ha.json' // Hausa, Provided By Google
import haw from './locales/haw.json' // Hawaiian, Provided By Google
import he from './locales/he.json' // Hebrew, Provided By Bing
import hi from './locales/hi.json' // Hindi, Provided By Bing
import hmn from './locales/hmn.json' // Hmong, Provided By Google
import hr from './locales/hr.json' // Croatian, Provided By Bing
import hsb from './locales/hsb.json' // Upper Sorbian, Provided By Bing
import ht from './locales/ht.json' // Haitian Creole, Provided By Bing
import hu from './locales/hu.json' // Hungarian, Provided By DeepL
import hy from './locales/hy.json' // Armenian, Provided By Bing
import id from './locales/id.json' // Indonesian, Provided By DeepL
import ig from './locales/ig.json' // Igbo, Provided By Google
import ikt from './locales/ikt.json' // Inuinnaqtun, Provided By Bing
import ilo from './locales/ilo.json' // Ilocano, Provided By Google
import is from './locales/is.json' // Icelandic, Provided By Bing
import it from './locales/it.json' // Italian, Provided By DeepL
import iu from './locales/iu.json' // Inuktitut, Provided By Bing
import ja from './locales/ja.json' // Japanese, Provided By DeepL
import jv from './locales/jv.json' // Javanese, Provided By Bing
import ka from './locales/ka.json' // Georgian, Provided By Google
import kk from './locales/kk.json' // Kazakh, Provided By Bing
import km from './locales/km.json' // Khmer, Provided By Bing
import kmr from './locales/kmr.json' // Kurdish (Northern), Provided By Bing
import kn from './locales/kn.json' // Kannada, Provided By Bing
import ko from './locales/ko.json' // Korean, Provided By DeepL
import kri from './locales/kri.json' // Krio, Provided By Google
import ku from './locales/ku.json' // Kurdish, Provided By Bing
import ky from './locales/ky.json' // Kyrgyz, Provided By Bing
import la from './locales/la.json' // Latin, Provided By Google
import lb from './locales/lb.json' // Luxembourgish, Provided By Google
import lg from './locales/lg.json' // Luganda, Provided By Google
import ln from './locales/ln.json' // Lingala, Provided By Google
import lo from './locales/lo.json' // Lao, Provided By Bing
import lt from './locales/lt.json' // Lithuanian, Provided By DeepL
import lus from './locales/lus.json' // Mizo, Provided By Google
import lv from './locales/lv.json' // Latvian, Provided By DeepL
import mai from './locales/mai.json' // Maithili, Provided By Google
import mg from './locales/mg.json' // Malagasy, Provided By Bing
import mi from './locales/mi.json' // Maori, Provided By Bing
import mk from './locales/mk.json' // Macedonian, Provided By Bing
import ml from './locales/ml.json' // Malayalam, Provided By Bing
import mn from './locales/mn.json' // Mongolian, Provided By Bing
import mni from './locales/mni.json' // Meiteilon (Manipuri), Provided By Google
import mr from './locales/mr.json' // Marathi, Provided By Bing
import ms from './locales/ms.json' // Malay, Provided By Bing
import mt from './locales/mt.json' // Maltese, Provided By Bing
import mww from './locales/mww.json' // Hmong Daw, Provided By Bing
import my from './locales/my.json' // Myanmar (Burmese), Provided By Bing
import ne from './locales/ne.json' // Nepali, Provided By Bing
import nl from './locales/nl.json' // Dutch, Provided By DeepL
import no from './locales/no.json' // Norwegian, Provided By DeepL
import nso from './locales/nso.json' // Sepedi, Provided By Google
import ny from './locales/ny.json' // Nyanja (Chichewa), Provided By Google
import om from './locales/om.json' // Oromo, Provided By Google
import or from './locales/or.json' // Odia (Oriya), Provided By Bing
import otq from './locales/otq.json' // Queretaro Otomi, Provided By Bing
import pa from './locales/pa.json' // Punjabi, Provided By Bing
import pl from './locales/pl.json' // Polish, Provided By DeepL
import prs from './locales/prs.json' // Dari, Provided By Bing
import ps from './locales/ps.json' // Pashto, Provided By Bing
import pt from './locales/pt.json' // Portuguese (Portugal, Brazil), Provided By DeepL
import qu from './locales/qu.json' // Quechua, Provided By Google
import ro from './locales/ro.json' // Romanian, Provided By DeepL
import ru from './locales/ru.json' // Russian, Provided By DeepL
import rw from './locales/rw.json' // Kinyarwanda, Provided By Google
import sa from './locales/sa.json' // Sanskrit, Provided By Google
import sd from './locales/sd.json' // Sindhi, Provided By Google
import si from './locales/si.json' // Sinhala (Sinhalese), Provided By Google
import sk from './locales/sk.json' // Slovak, Provided By DeepL
import sl from './locales/sl.json' // Slovenian, Provided By DeepL
import sm from './locales/sm.json' // Samoan, Provided By Bing
import sn from './locales/sn.json' // Shona, Provided By Google
import so from './locales/so.json' // Somali, Provided By Bing
import sq from './locales/sq.json' // Albanian, Provided By Bing
import sr from './locales/sr.json' // Serbian, Provided By Bing
import st from './locales/st.json' // Sesotho, Provided By Google
import su from './locales/su.json' // Sundanese, Provided By Google
import sv from './locales/sv.json' // Swedish, Provided By DeepL
import sw from './locales/sw.json' // Swahili, Provided By Bing
import ta from './locales/ta.json' // Tamil, Provided By Bing
import te from './locales/te.json' // Telugu, Provided By Bing
import tg from './locales/tg.json' // Tajik, Provided By Google
import th from './locales/th.json' // Thai, Provided By Bing
import ti from './locales/ti.json' // Tigrinya, Provided By Bing
import tk from './locales/tk.json' // Turkmen, Provided By Bing
import tl from './locales/tl.json' // Tagalog (Filipino), Provided By Google
import to from './locales/to.json' // Tongan, Provided By Bing
import tr from './locales/tr.json' // Turkish, Provided By DeepL
import ts from './locales/ts.json' // Tsonga, Provided By Google
import tt from './locales/tt.json' // Tatar, Provided By Bing
import ty from './locales/ty.json' // Tahitian, Provided By Bing
import ug from './locales/ug.json' // Uyghur, Provided By Bing
import uk from './locales/uk.json' // Ukrainian, Provided By DeepL
import ur from './locales/ur.json' // Urdu, Provided By Bing
import uz from './locales/uz.json' // Uzbek, Provided By Bing
import vi from './locales/vi.json' // Vietnamese, Provided By Bing
import xh from './locales/xh.json' // Xhosa, Provided By Google
import yi from './locales/yi.json' // Yiddish, Provided By Google
import yo from './locales/yo.json' // Yoruba, Provided By Google
import yua from './locales/yua.json' // Yucatec Maya, Provided By Bing
import yue from './locales/yue.json' // Cantonese (Traditional), Provided By Bing
import zhCN from './locales/zh-CN.json' // Chinese (Simplified), Provided By DeepL
import zhTW from './locales/zh-TW.json' // Chinese (Traditional), Provided By Bing
import zu from './locales/zu.json' // Zulu, Provided By Bing

const locales = {
  af: { translation: af }, // Afrikaans, Provided By Bing
  ak: { translation: ak }, // Twi (Akan), Provided By Google
  am: { translation: am }, // Amharic, Provided By Bing
  ar: { translation: ar }, // Arabic, Provided By Bing
  as: { translation: as }, // Assamese, Provided By Bing
  ay: { translation: ay }, // Aymara, Provided By Google
  az: { translation: az }, // Azerbaijani, Provided By Bing
  ba: { translation: ba }, // Bashkir, Provided By Bing
  be: { translation: be }, // Belarusian, Provided By Google
  bg: { translation: bg }, // Bulgarian, Provided By DeepL
  bho: { translation: bho }, // Bhojpuri, Provided By Google
  bm: { translation: bm }, // Bambara, Provided By Google
  bn: { translation: bn }, // Bengali, Provided By Bing
  bo: { translation: bo }, // Tibetan, Provided By Bing
  bs: { translation: bs }, // Bosnian, Provided By Bing
  ca: { translation: ca }, // Catalan, Provided By Bing
  ceb: { translation: ceb }, // Cebuano, Provided By Google
  ckb: { translation: ckb }, // Kurdish (Sorani), Provided By Google
  co: { translation: co }, // Corsican, Provided By Google
  cs: { translation: cs }, // Czech, Provided By DeepL
  cy: { translation: cy }, // Welsh, Provided By Bing
  da: { translation: da }, // Danish, Provided By DeepL
  de: { translation: de }, // German, Provided By DeepL
  doi: { translation: doi }, // Dogri, Provided By Google
  dv: { translation: dv }, // Dhivehi, Provided By Bing
  ee: { translation: ee }, // Ewe, Provided By Google
  el: { translation: el }, // Greek, Provided By DeepL
  en: { translation: en }, // English, Provided By DeepL
  eo: { translation: eo }, // Esperanto, Provided By Google
  es: { translation: es }, // Spanish, Provided By DeepL
  et: { translation: et }, // Estonian, Provided By DeepL
  eu: { translation: eu }, // Basque, Provided By Bing
  fa: { translation: fa }, // Persian, Provided By Bing
  fi: { translation: fi }, // Finnish, Provided By DeepL
  fil: { translation: fil }, // Filipino (Tagalog), Provided By Bing
  fj: { translation: fj }, // Fijian, Provided By Bing
  fo: { translation: fo }, // Faroese, Provided By Bing
  fr: { translation: fr }, // French, Provided By DeepL
  fy: { translation: fy }, // Frisian, Provided By Google
  ga: { translation: ga }, // Irish, Provided By Bing
  gd: { translation: gd }, // Scots Gaelic, Provided By Google
  gl: { translation: gl }, // Galician, Provided By Bing
  gn: { translation: gn }, // Guarani, Provided By Google
  gom: { translation: gom }, // Konkani, Provided By Google
  gu: { translation: gu }, // Gujarati, Provided By Bing
  ha: { translation: ha }, // Hausa, Provided By Google
  haw: { translation: haw }, // Hawaiian, Provided By Google
  he: { translation: he }, // Hebrew, Provided By Bing
  hi: { translation: hi }, // Hindi, Provided By Bing
  hmn: { translation: hmn }, // Hmong, Provided By Google
  hr: { translation: hr }, // Croatian, Provided By Bing
  hsb: { translation: hsb }, // Upper Sorbian, Provided By Bing
  ht: { translation: ht }, // Haitian Creole, Provided By Bing
  hu: { translation: hu }, // Hungarian, Provided By DeepL
  hy: { translation: hy }, // Armenian, Provided By Bing
  id: { translation: id }, // Indonesian, Provided By DeepL
  ig: { translation: ig }, // Igbo, Provided By Google
  ikt: { translation: ikt }, // Inuinnaqtun, Provided By Bing
  ilo: { translation: ilo }, // Ilocano, Provided By Google
  is: { translation: is }, // Icelandic, Provided By Bing
  it: { translation: it }, // Italian, Provided By DeepL
  iu: { translation: iu }, // Inuktitut, Provided By Bing
  ja: { translation: ja }, // Japanese, Provided By DeepL
  jv: { translation: jv }, // Javanese, Provided By Bing
  ka: { translation: ka }, // Georgian, Provided By Google
  kk: { translation: kk }, // Kazakh, Provided By Bing
  km: { translation: km }, // Khmer, Provided By Bing
  kmr: { translation: kmr }, // Kurdish (Northern), Provided By Bing
  kn: { translation: kn }, // Kannada, Provided By Bing
  ko: { translation: ko }, // Korean, Provided By DeepL
  kri: { translation: kri }, // Krio, Provided By Google
  ku: { translation: ku }, // Kurdish, Provided By Bing
  ky: { translation: ky }, // Kyrgyz, Provided By Bing
  la: { translation: la }, // Latin, Provided By Google
  lb: { translation: lb }, // Luxembourgish, Provided By Google
  lg: { translation: lg }, // Luganda, Provided By Google
  ln: { translation: ln }, // Lingala, Provided By Google
  lo: { translation: lo }, // Lao, Provided By Bing
  lt: { translation: lt }, // Lithuanian, Provided By DeepL
  lus: { translation: lus }, // Mizo, Provided By Google
  lv: { translation: lv }, // Latvian, Provided By DeepL
  mai: { translation: mai }, // Maithili, Provided By Google
  mg: { translation: mg }, // Malagasy, Provided By Bing
  mi: { translation: mi }, // Maori, Provided By Bing
  mk: { translation: mk }, // Macedonian, Provided By Bing
  ml: { translation: ml }, // Malayalam, Provided By Bing
  mn: { translation: mn }, // Mongolian, Provided By Bing
  mni: { translation: mni }, // Meiteilon (Manipuri), Provided By Google
  mr: { translation: mr }, // Marathi, Provided By Bing
  ms: { translation: ms }, // Malay, Provided By Bing
  mt: { translation: mt }, // Maltese, Provided By Bing
  mww: { translation: mww }, // Hmong Daw, Provided By Bing
  my: { translation: my }, // Myanmar (Burmese), Provided By Bing
  ne: { translation: ne }, // Nepali, Provided By Bing
  nl: { translation: nl }, // Dutch, Provided By DeepL
  no: { translation: no }, // Norwegian, Provided By DeepL
  nso: { translation: nso }, // Sepedi, Provided By Google
  ny: { translation: ny }, // Nyanja (Chichewa), Provided By Google
  om: { translation: om }, // Oromo, Provided By Google
  or: { translation: or }, // Odia (Oriya), Provided By Bing
  otq: { translation: otq }, // Queretaro Otomi, Provided By Bing
  pa: { translation: pa }, // Punjabi, Provided By Bing
  pl: { translation: pl }, // Polish, Provided By DeepL
  prs: { translation: prs }, // Dari, Provided By Bing
  ps: { translation: ps }, // Pashto, Provided By Bing
  pt: { translation: pt }, // Portuguese (Portugal, Brazil), Provided By DeepL
  qu: { translation: qu }, // Quechua, Provided By Google
  ro: { translation: ro }, // Romanian, Provided By DeepL
  ru: { translation: ru }, // Russian, Provided By DeepL
  rw: { translation: rw }, // Kinyarwanda, Provided By Google
  sa: { translation: sa }, // Sanskrit, Provided By Google
  sd: { translation: sd }, // Sindhi, Provided By Google
  si: { translation: si }, // Sinhala (Sinhalese), Provided By Google
  sk: { translation: sk }, // Slovak, Provided By DeepL
  sl: { translation: sl }, // Slovenian, Provided By DeepL
  sm: { translation: sm }, // Samoan, Provided By Bing
  sn: { translation: sn }, // Shona, Provided By Google
  so: { translation: so }, // Somali, Provided By Bing
  sq: { translation: sq }, // Albanian, Provided By Bing
  sr: { translation: sr }, // Serbian, Provided By Bing
  st: { translation: st }, // Sesotho, Provided By Google
  su: { translation: su }, // Sundanese, Provided By Google
  sv: { translation: sv }, // Swedish, Provided By DeepL
  sw: { translation: sw }, // Swahili, Provided By Bing
  ta: { translation: ta }, // Tamil, Provided By Bing
  te: { translation: te }, // Telugu, Provided By Bing
  tg: { translation: tg }, // Tajik, Provided By Google
  th: { translation: th }, // Thai, Provided By Bing
  ti: { translation: ti }, // Tigrinya, Provided By Bing
  tk: { translation: tk }, // Turkmen, Provided By Bing
  tl: { translation: tl }, // Tagalog (Filipino), Provided By Google
  to: { translation: to }, // Tongan, Provided By Bing
  tr: { translation: tr }, // Turkish, Provided By DeepL
  ts: { translation: ts }, // Tsonga, Provided By Google
  tt: { translation: tt }, // Tatar, Provided By Bing
  ty: { translation: ty }, // Tahitian, Provided By Bing
  ug: { translation: ug }, // Uyghur, Provided By Bing
  uk: { translation: uk }, // Ukrainian, Provided By DeepL
  ur: { translation: ur }, // Urdu, Provided By Bing
  uz: { translation: uz }, // Uzbek, Provided By Bing
  vi: { translation: vi }, // Vietnamese, Provided By Bing
  xh: { translation: xh }, // Xhosa, Provided By Google
  yi: { translation: yi }, // Yiddish, Provided By Google
  yo: { translation: yo }, // Yoruba, Provided By Google
  yua: { translation: yua }, // Yucatec Maya, Provided By Bing
  yue: { translation: yue }, // Cantonese (Traditional), Provided By Bing
  'zh-CN': { translation: zhCN }, // Chinese (Simplified), Provided By DeepL
  'zh-TW': { translation: zhTW }, // Chinese (Traditional), Provided By Bing
  zu: { translation: zu }, // Zulu, Provided By Bing
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    fallbackLng: 'en',
    resources: locales,
  })

export const allowedLocalesList = Object.keys(locales)

export default i18n
