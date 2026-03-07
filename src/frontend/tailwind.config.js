/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    extend: {
      fontFamily: {
        balsamiq: ["Balsamiq Sans", "cursive"],
      },
      animation: {
        "fade-pulse": "fade-pulse 1.2s ease-in-out infinite",
      },
      keyframes: {
        "fade-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
