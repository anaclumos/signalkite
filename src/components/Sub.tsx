import React from 'react'
import clsx from 'clsx'
import styles from './Sub.module.css'
import Translate from '@docusaurus/Translate'

export const Sub = () => {
  return (
    <form method="post" action="https://newsletters.cho.sh/subscription/form" className={clsx(styles.form)}>
      <div>
        <h1>
          <Translate>Subscribe</Translate>
        </h1>

        <input type="hidden" name="nonce" />
        <h2 className={clsx(styles.question)}>
          <Translate>First, may I have your contact?</Translate>
        </h2>
        <input type="email" name="email" required placeholder="Email" className={clsx(styles.input)} />
        <h2 className={clsx(styles.question)}>
          <Translate>Next, what languages do you speak?</Translate>
        </h2>
        <section className={clsx(styles.localeSection)}>
          <label htmlFor="d23b0" className={clsx(styles.locale)}>
            <input
              id="d23b0"
              type="checkbox"
              name="l"
              value="d23b071a-ee87-4dc8-9fd9-1e311df2551c"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>ar</span>
              العربية
            </div>
          </label>
          <label htmlFor="07ac4" className={clsx(styles.locale)}>
            <input
              id="07ac4"
              type="checkbox"
              name="l"
              value="07ac4cd7-0a94-464a-a4ca-e5d74874ff38"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>bn</span>
              বাংলা
            </div>
          </label>
          <label htmlFor="306f0" className={clsx(styles.locale)}>
            <input
              id="306f0"
              type="checkbox"
              name="l"
              value="306f0b81-393a-44ac-a5c3-ecbb0e9418be"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>cs</span>
              Čeština
            </div>
          </label>
          <label htmlFor="b0348" className={clsx(styles.locale)}>
            <input
              id="b0348"
              type="checkbox"
              name="l"
              value="b034802b-cedc-480e-8eed-987a4d8d1da2"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>da</span>
              Dansk
            </div>
          </label>
          <label htmlFor="52954" className={clsx(styles.locale)}>
            <input
              id="52954"
              type="checkbox"
              name="l"
              value="52954b4c-618f-47a1-aede-db215fe34224"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>de</span>
              Deutsch
            </div>
          </label>
          <label htmlFor="f6b4d" className={clsx(styles.locale)}>
            <input
              id="f6b4d"
              type="checkbox"
              name="l"
              value="f6b4d6f2-5153-44dd-9218-eabba3d11b6c"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>el</span>
              Ελληνικά
            </div>
          </label>
          <label htmlFor="4ecc0" className={clsx(styles.locale)}>
            <input
              id="4ecc0"
              type="checkbox"
              name="l"
              value="4ecc0fef-6f96-40ca-8fb5-6d13a2a836fc"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>en</span>
              English
            </div>
          </label>
          <label htmlFor="5f59e" className={clsx(styles.locale)}>
            <input
              id="5f59e"
              type="checkbox"
              name="l"
              value="5f59ec4d-f60d-47f8-b696-35454037a700"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>es</span>
              Español
            </div>
          </label>
          <label htmlFor="d473a" className={clsx(styles.locale)}>
            <input
              id="d473a"
              type="checkbox"
              name="l"
              value="d473a1b5-8d98-4e99-b0e6-798893f07e72"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>fi</span>
              Suomi
            </div>
          </label>
          <label htmlFor="d5c07" className={clsx(styles.locale)}>
            <input
              id="d5c07"
              type="checkbox"
              name="l"
              value="d5c075a9-5857-4def-bf87-574571c41ddf"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>fr</span>
              Français
            </div>
          </label>
          <label htmlFor="056cb" className={clsx(styles.locale)}>
            <input
              id="056cb"
              type="checkbox"
              name="l"
              value="056cb2a4-530e-47b4-9ec3-57c1a8fc89b5"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>he</span>
              עברית
            </div>
          </label>
          <label htmlFor="868cc" className={clsx(styles.locale)}>
            <input
              id="868cc"
              type="checkbox"
              name="l"
              value="868ccbda-32a2-4239-8c6b-3a05b3e894e0"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>hi</span>
              हिंदी
            </div>
          </label>
          <label htmlFor="d0a87" className={clsx(styles.locale)}>
            <input
              id="d0a87"
              type="checkbox"
              name="l"
              value="d0a873f8-e26a-4fb2-8c2f-4a6a7da231b7"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>hu</span>
              Magyar
            </div>
          </label>
          <label htmlFor="65116" className={clsx(styles.locale)}>
            <input
              id="65116"
              type="checkbox"
              name="l"
              value="65116af5-a8f8-4a48-9e84-5743818c1138"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>id</span>
              Indonesia
            </div>
          </label>
          <label htmlFor="b2c1f" className={clsx(styles.locale)}>
            <input
              id="b2c1f"
              type="checkbox"
              name="l"
              value="b2c1f107-f278-4fe9-b311-6b0f16ada56a"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>it</span>
              Italiano
            </div>
          </label>
          <label htmlFor="f3087" className={clsx(styles.locale)}>
            <input
              id="f3087"
              type="checkbox"
              name="l"
              value="f3087ae3-fc01-4bf0-8ddb-b837991d815d"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>ja</span>
              日本語
            </div>
          </label>
          <label htmlFor="61d50" className={clsx(styles.locale)}>
            <input
              id="61d50"
              type="checkbox"
              name="l"
              value="61d50954-def8-4e11-8c7d-619e3ad61750"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>ko</span>
              한국어
            </div>
          </label>
          <label htmlFor="e8dd3" className={clsx(styles.locale)}>
            <input
              id="e8dd3"
              type="checkbox"
              name="l"
              value="e8dd3929-646d-41f9-999e-c1f24a5e2950"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>nb</span>
              Bokmål
            </div>
          </label>
          <label htmlFor="b0ab7" className={clsx(styles.locale)}>
            <input
              id="b0ab7"
              type="checkbox"
              name="l"
              value="b0ab7199-158a-409b-b5ea-fe8442a9bb6c"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>nl</span>
              Nederlands
            </div>
          </label>
          <label htmlFor="4332f" className={clsx(styles.locale)}>
            <input
              id="4332f"
              type="checkbox"
              name="l"
              value="4332f47d-0ebb-405c-82c8-9ee7ca3288f9"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>pl</span>
              Polski
            </div>
          </label>
          <label htmlFor="ff5bd" className={clsx(styles.locale)}>
            <input
              id="ff5bd"
              type="checkbox"
              name="l"
              value="ff5bd42d-2202-4dc1-9d56-f331ea3de4f1"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>pt</span>
              Português
            </div>
          </label>
          <label htmlFor="bdb1a" className={clsx(styles.locale)}>
            <input
              id="bdb1a"
              type="checkbox"
              name="l"
              value="bdb1af01-4117-4647-a45c-016dc6e8d231"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>ro</span>
              Română
            </div>
          </label>
          <label htmlFor="43559" className={clsx(styles.locale)}>
            <input
              id="43559"
              type="checkbox"
              name="l"
              value="43559490-cc7e-4931-b456-974f27737f27"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>ru</span>
              Русский
            </div>
          </label>
          <label htmlFor="be766" className={clsx(styles.locale)}>
            <input
              id="be766"
              type="checkbox"
              name="l"
              value="be76696b-119f-468a-b5ce-861c7c60f244"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>sk</span>
              Slovenčina
            </div>
          </label>
          <label htmlFor="55c70" className={clsx(styles.locale)}>
            <input
              id="55c70"
              type="checkbox"
              name="l"
              value="55c70ef2-a0b9-4689-9331-66e9b2166813"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>sv</span>
              Svenska
            </div>
          </label>
          <label htmlFor="0c4c1" className={clsx(styles.locale)}>
            <input
              id="0c4c1"
              type="checkbox"
              name="l"
              value="0c4c1b65-dff2-4eac-af46-f57a785305b5"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>ta</span>
              தமிழ்
            </div>
          </label>
          <label htmlFor="03e41" className={clsx(styles.locale)}>
            <input
              id="03e41"
              type="checkbox"
              name="l"
              value="03e41de6-da17-40b0-bd58-ca79d0655cbc"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>th</span>
              ไทย
            </div>
          </label>
          <label htmlFor="2120b" className={clsx(styles.locale)}>
            <input
              id="2120b"
              type="checkbox"
              name="l"
              value="2120be4a-dc37-4520-992a-ad78e1017a8c"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>tr</span>
              Türkçe
            </div>
          </label>
          <label htmlFor="61502" className={clsx(styles.locale)}>
            <input
              id="61502"
              type="checkbox"
              name="l"
              value="6150256a-eced-4e91-adf8-4504c176e673"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>zh-Hans</span>
              简体中文
            </div>
          </label>

          <label htmlFor="2a064" className={clsx(styles.locale)}>
            <input
              id="2a064"
              type="checkbox"
              name="l"
              value="2a064262-4ded-49e1-bfba-86936b3d56e5"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>zh-Hant</span>
              繁體中文
            </div>
          </label>
        </section>

        <h2 className={clsx(styles.question)}>Would you mind receiving updates on what I'm working on?</h2>

        <section className={clsx(styles.localeSection)}>
          <label htmlFor="ed372" className={clsx(styles.locale)}>
            <input
              id="ed372"
              type="checkbox"
              name="l"
              value="ed372c11-9f49-4d41-aecf-d8893bf48996"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>개발자의 새 소식</span>
              한국어
            </div>
          </label>
          <label htmlFor="5ebfb" className={clsx(styles.locale)}>
            <input
              id="5ebfb"
              type="checkbox"
              name="l"
              value="5ebfb430-82b5-47b8-b74b-c7b7d17bb97b"
              className={clsx(styles.localeCheckbox)}
            />
            <div className={clsx(styles.lang)}>
              <span className={clsx(styles.localeCode)}>Developer's Updates</span>
              English
            </div>
          </label>
        </section>
        <input type="submit" value="Subscribe" className={clsx(styles.submit)} />
      </div>
    </form>
  )
}
