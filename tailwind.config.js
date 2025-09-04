/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#2563eb", // primary brand color (blue-600)
          light: "#3b82f6", // lighter blue
          dark: "#1e40af", // darker blue
        },
      },
    },
  },
  plugins: [],
};
