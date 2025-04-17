/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#374151",
      },
      backgroundColor: {
        primary: "#72B173",
        "primary-dark": "#225433",
        "primary-light": "#F0F9F2",
      },
      fontFamily: {
        "source-serif-4": ["'Source Serif 4'", "serif"],
        "source-sans-pro": ["'Source Sans Pro'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
