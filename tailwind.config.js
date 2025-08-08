module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#3A63F1",
          50: "#EEF2FF",
          100: "#E0E7FF",
          600: "#3456CE",
          800: "#23348C",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Noto Sans", "Ubuntu", "Cantarell", "Helvetica Neue", "Arial", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"],
      },
      borderRadius: { xl: "1rem", "2xl": "1.25rem" },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.04)",
        hover: "0 2px 6px rgba(0,0,0,0.08), 0 10px 24px rgba(0,0,0,0.06)",
      },
      animation: {
        "fade-in": "fade-in 300ms ease-out",
      },
      keyframes: {
        "fade-in": { from: { opacity: 0, transform: "translateY(2px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
