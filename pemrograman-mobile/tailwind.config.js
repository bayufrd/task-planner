/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#007AFF",
        secondary: "#5856D6",
        success: "#4CD964",
        danger: "#FF3B30",
        warning: "#FFCC00",
        info: "#5AC8FA",
        light: "#F2F2F7",
        dark: "#1C1C1E",
      },
    },
  },
  plugins: [],
};
