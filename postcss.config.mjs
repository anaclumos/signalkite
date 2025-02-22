/**
 * PostCSS Configuration
 * Configures CSS processing plugins and transformations
 * @type {import('postcss-load-config').Config}
 */
const config = {
  // Configure PostCSS plugins
  plugins: {
    // Tailwind CSS PostCSS plugin
    // Processes Tailwind directives and generates utility classes
    "@tailwindcss/postcss": {},
  },
}

export default config
