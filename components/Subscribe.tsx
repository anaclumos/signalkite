import React from 'react'

import { Steps, Cards } from 'nextra-theme-docs'

const Subscribe = () => {
  return (
    <form method="post" action="https://newsletters.cho.sh/subscription/form" id="subscribe-form">
      <Steps>
        <h2 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-mt-10 nx-border-b nx-pb-1 nx-text-3xl nx-border-neutral-200/70 contrast-more:nx-border-neutral-400 dark:nx-border-primary-100/10 contrast-more:dark:nx-border-neutral-400">
          Subscribe
        </h2>
        <h3 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-mt-8 nx-mb-8 nx-text-2xl">
          First, Your Email?
        </h3>
        <input
          type="email"
          name="email"
          required
          placeholder="elon@twitter.com"
          className="nextra-callout nx-overflow-x-auto nx-w-full nx-m-2 nx-flex nx-rounded-lg nx-border nx-p-4 ltr:nx-pr-4 rtl:nx-pl-4 contrast-more:nx-border-current contrast-more:dark:nx-border-current nx-border-gray-200 nx-text-current nx-no-underline dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900 language-card peer-checked:border-gray-900"
        />
        <h3 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-mt-8 nx-text-2xl">
          Next, Your Languages.
        </h3>

        <Cards>
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
            ['Bahasa Indonesia (id)', '65116', '65116af5-a8f8-4a48-9e84-5743818c1138'],
            ['Italiano (it)', 'b2c1f', 'b2c1f107-f278-4fe9-b311-6b0f16ada56a'],
            ['日本語 (ja)', 'f3087', 'f3087ae3-fc01-4bf0-8ddb-b837991d815d'],
            ['한국어 (ko)', '61d50', '61d50954-def8-4e11-8c7d-619e3ad61750'],
            ['Lietuvių (lt)', '81b93', '81b93cc7-8d0a-4c97-9e92-0cc10d05080e'],
            ['Latviešu (lv)', 'fc7b0', 'fc7b0d46-24be-48fd-9cac-e9103d2b0a13'],
            ['Bokmål (nb)', 'e8dd3', 'e8dd3929-646d-41f9-999e-c1f24a5e2950'],
            ['Nederlands (nl)', 'b0ab7', 'b0ab7199-158a-409b-b5ea-fe8442a9bb6c'],
            ['Polski (pl)', '4332f', '4332f47d-0ebb-405c-82c8-9ee7ca3288f9'],
            ['Português (pt)', 'ff5bd', 'ff5bd42d-2202-4dc1-9d56-f331ea3de4f1'],
            ['Română (ro)', 'bdb1a', 'bdb1af01-4117-4647-a45c-016dc6e8d231'],
            ['Русский (ru)', '43559', '43559490-cc7e-4931-b456-974f27737f27'],
            ['Slovenčina (sk)', 'be766', 'be76696b-119f-468a-b5ce-861c7c60f244'],
            ['Slovenščina (sl)', '3d77b', '3d77b1b6-9204-435f-8855-f60a7943c69c'],
            ['Svenska (sv)', '55c70', '55c70ef2-a0b9-4689-9331-66e9b2166813'],
            ['Türkçe (tr)', '2120b', '2120be4a-dc37-4520-992a-ad78e1017a8c'],
            ['Українська (uk)', '1a923', '1a9237b8-2ada-43d7-8b7d-da9d54530212'],
            ['中文 (zh)', '61502', '6150256a-eced-4e91-adf8-4504c176e673'],
          ].map(([text, id, value]) => (
            <label
              key={id}
              className="nextra-card nx-group nx-flex nx-items-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200 nx-text-current nx-no-underline dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900 language-card nx-cursor-pointer peer-checked:border-gray-900"
              htmlFor={id}
            >
              <input id={id} type="checkbox" name="l" value={value} className="nx-peer nx-sr-only" />
              <span className="nx-flex nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900 dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50 peer-checked:nx-text-gray-900">
                {text}
              </span>
            </label>
          ))}
        </Cards>

        <h3 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-mt-8 nx-text-2xl">
          Can I send updates on what I'm working on?
        </h3>
        <p className="nx-text-gray-700 dark:nx-text-neutral-300 nx-mt-2">
          You don't need to select anything here, but I do send something extraordinary ;)
        </p>
        <Cards>
          {[
            ['Yes, in English!', '5ebfb', '5ebfb430-82b5-47b8-b74b-c7b7d17bb97b'],
            ['네, 한국어로요!', 'ed372', 'ed372c11-9f49-4d41-aecf-d8893bf48996'],
          ].map(([text, id, value]) => (
            <label
              key={id}
              className="nextra-card nx-group nx-flex nx-items-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200 nx-text-current nx-no-underline dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900 language-card nx-cursor-pointer peer-checked:border-gray-900"
              htmlFor={id}
            >
              <input id={id} type="checkbox" name="l" value={value} className="nx-peer nx-sr-only" />
              <span className="nx-flex nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900 dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50 peer-checked:nx-text-gray-900">
                {text}
              </span>
            </label>
          ))}
        </Cards>
        <h3 className="nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100 nx-mt-8 nx-text-2xl">
          Now, Submit!
        </h3>
        <button
          type="submit"
          className="nx-w-full nx-py-4 nx-px-4 nx-my-4 nx-border nx-border-gray-200 nx-rounded-lg nx-bg-blue-500 nx-text-white nx-font-semibold nx-text-md hover:nx-bg-blue-600 focus:nx-outline-none focus:nx-ring-4 focus:nx-ring-blue-300 active:nx-bg-blue-700 nx-duration-150 dark:nx-shadow-none hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100 active:nx-shadow-sm active:nx-shadow-gray-200 nx-transition-all nx-duration-200 hover:nx-border-gray-300 nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900 transition ease-in-out"
        >
          Submit
        </button>
      </Steps>
    </form>
  )
}

export default Subscribe
