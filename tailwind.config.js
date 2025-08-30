/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/aspect-ratio')
  ],
  safelist: [
    // Safelist common grid classes to prevent purging
    'grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4', 'grid-cols-5',
    'md:grid-cols-1', 'md:grid-cols-2', 'md:grid-cols-3', 'md:grid-cols-4', 'md:grid-cols-5',
    'aspect-w-1', 'aspect-w-4', 'aspect-h-1', 'aspect-h-3'
  ]
}
