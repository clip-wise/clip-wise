/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx,mdx}",
    "./src/*.{html,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      perspective: {
        1000: "1000px",
      },
    },
  },
  variants: {},
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
        ".transform-style-preserve-3d": {
          "transform-style": "preserve-3d",
        },
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
