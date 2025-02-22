// Import Tailwind configuration type
import type { Config } from "tailwindcss"

/**
 * Tailwind CSS Configuration
 * Defines styling utilities, theme extensions, and animations
 */
export default {
  // Enable dark mode using class strategy
  // Allows manual dark mode toggle via 'dark' class
  darkMode: "class",

  // Specify files to scan for utility classes
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Component files
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // App routes/pages
    "./lib/**/*.{js,ts,jsx,tsx,mdx}", // Library utilities
  ],

  // Theme customization
  theme: {
    extend: {
      // Custom color definitions
      colors: {
        gray: { 925: "#050814" }, // Very dark gray for backgrounds
      },

      // Animation keyframe definitions
      keyframes: {
        // Fade out animation
        hide: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },

        // Drawer animations
        drawerSlideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(-100%)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        drawerSlideRightAndFade: {
          from: { opacity: "1", transform: "translateX(0)" },
          to: { opacity: "0", transform: "translateX(-100%)" },
        },

        // Dropdown/Popover animations
        slideDownAndFade: {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideLeftAndFade: {
          from: { opacity: "0", transform: "translateX(6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        slideUpAndFade: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRightAndFade: {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },

        // Accordion animations
        accordionOpen: {
          from: { height: "0px" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        accordionClose: {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0px" },
        },
      },

      // Animation utility classes
      animation: {
        // Basic fade animation
        hide: "hide 150ms cubic-bezier(0.16, 1, 0.3, 1)",

        // Dropdown/Popover animations with easing
        slideDownAndFade:
          "slideDownAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideLeftAndFade:
          "slideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideUpAndFade: "slideUpAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideRightAndFade:
          "slideRightAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",

        // Accordion animations with custom easing
        accordionOpen: "accordionOpen 150ms cubic-bezier(0.87, 0, 0.13, 1)",
        accordionClose: "accordionClose 150ms cubic-bezier(0.87, 0, 0.13, 1)",

        // Drawer animations
        drawerSlideLeftAndFade:
          "drawerSlideLeftAndFade 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        drawerSlideRightAndFade: "drawerSlideRightAndFade 150ms ease-in",
      },
    },
  },

  // Additional Tailwind plugins
  plugins: [
    require("@tailwindcss/forms"), // Enhanced form input styling
  ],
} satisfies Config
