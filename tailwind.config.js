/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FAF7F0",
          deep: "#F1EBDB",
          line: "#E4D9C0",
        },
        ink: {
          DEFAULT: "#28231F",
          soft: "#7A6F5E",
          faint: "#A79C88",
        },
        pen: {
          DEFAULT: "#33507B",
          light: "#5D7CA6",
          pale: "#D8E1EC",
        },
        coral: {
          DEFAULT: "#D9694A",
          pale: "#F3DCD2",
        },
        moss: {
          DEFAULT: "#5B7A5E",
          pale: "#DCE6DC",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        page: "0 1px 2px rgba(40, 35, 31, 0.04), 0 8px 24px -8px rgba(40, 35, 31, 0.12)",
        tab: "0 2px 6px rgba(40, 35, 31, 0.18)",
      },
      borderRadius: {
        page: "0.375rem",
      },
    },
  },
  plugins: [],
};
