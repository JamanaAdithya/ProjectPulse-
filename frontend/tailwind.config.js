const { default: tailwindcss } = require("@tailwindcss/vite");
const autoprefixer = require("autoprefixer");

module.exports = {
    content: [
      './index.html',
      './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
      extend: {},
    },
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
} 