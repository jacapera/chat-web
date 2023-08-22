/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scrollbar: {
        borderRadius: "12px", // Agrega el estilo de border-radius deseado
      },
    },
  },
  variants:{
    scrollbar:["rounded"],
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

