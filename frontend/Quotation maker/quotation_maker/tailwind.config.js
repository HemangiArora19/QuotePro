/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  future: {
    useOkLchColors: false, // 👈 fixes html2canvas crash
  },
  theme: {
    extend: {},
  },
  plugins: [],
}

