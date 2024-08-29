/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "slide-in-up": "slideInUp 0.3s ease-out",
        "slide-out-down": "slideOutDown 0.3s ease-in",
        "slide-in-down": "slideInDown 0.3s ease-out",
        "slide-out-up": "slideOutUp 0.3s ease-in",
      },
    },
  },
  plugins: [],
};
