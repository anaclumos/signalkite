/**
 * @type { import("@inlang/core/config").DefineConfig }
 */
export async function defineConfig(env) {
  const { default: jsonPlugin } = await env.$import(
    'https://cdn.jsdelivr.net/npm/@inlang/plugin-i18next@3/dist/index.js'
  )

  const { default: standardLintRules } = await env.$import(
    'https://cdn.jsdelivr.net/npm/@inlang/plugin-standard-lint-rules@3/dist/index.js'
  )

  return {
    referenceLanguage: 'en',
    plugins: [
      jsonPlugin({
        pathPattern: {
          blog: './i18n/{language}/docusaurus-plugin-content-blog/options.json',
          docs: './i18n/{language}/docusaurus-plugin-content-docs/current.json',
          'theme-footer': './i18n/{language}/docusaurus-theme-classic/footer.json',
          'theme-footer': './i18n/{language}/docusaurus-theme-classic/footer.json',
          code: './i18n/{language}/code.json',
        },
      }),
      standardLintRules(),
    ],
  }
}
