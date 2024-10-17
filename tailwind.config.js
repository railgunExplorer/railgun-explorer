/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
    require("tailwindcss/plugin")(function ({ addUtilities }) {
      addUtilities({
        ".backdrop-blur-sm": {
          "backdrop-filter": "blur(4px)",
        },
      });
    }),
  ],
};
