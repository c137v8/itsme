/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#09090b", // page
        panel: "#121215", // main document card
        line: "#25252b", // hairline borders
        chip: "#1c1c21", // neutral chip background
        ink: "#d4d4d8", // body text
        mute: "#a1a1aa", // secondary text
        dim: "#71717a", // labels
        heading: "#5aa9f5", // section headings
        code: "#f0508c", // inline code
        accent: {
          DEFAULT: "#3dd9b8", // links, tags, bullets
          bg: "#0e2a28",
          line: "#1f5d52",
        },
      },
      fontFamily: {
        sans: ['"Roboto Variable"', "system-ui", "sans-serif"],
        // ligatures off: JetBrains Mono otherwise renders "c++" as one glyph
        mono: [
          '"JetBrains Mono Variable", ui-monospace, monospace',
          { fontFeatureSettings: '"calt" 0, "liga" 0' },
        ],
      },
    },
  },
  plugins: [],
};
