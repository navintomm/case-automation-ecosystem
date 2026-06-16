/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        navy: '#1B2A4A',
        navyLight: '#243560',
        gold: '#C9963A',
        goldLight: '#F0C96B',
        cream: '#F7F5F0',
        cardBg: '#FFFFFF',
        verified: '#22843F',
        warning: '#D97706',
        error: '#C0392B',
        textPrimary: '#1A1A2E',
        textSecond: '#5A6478',
        textMuted: '#9AA3B2',
        border: '#E2E0DA',
        borderFocus: '#C9963A',
      },
      fontFamily: {
        display: ["DMSerifDisplay_400Regular"],
        sans: ["Inter_400Regular"],
        sansMedium: ["Inter_500Medium"],
        sansSemiBold: ["Inter_600SemiBold"],
        sansBold: ["Inter_700Bold"],
      }
    },
  },
  plugins: [],
}
