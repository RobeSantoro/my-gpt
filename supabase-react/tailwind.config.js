/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
      mytheme: {
        primary: "green",
        secondary: "white",
        accent: 'red',
        neutral: "white",
        "base-100": "#063f73",
        "base-content": "white"
      },
    }],
  },
};