/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Segoe UI', 'Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                vista: {
                    blue: '#1f72c2',
                    blueDark: '#0d4a8a',
                    blueLight: '#5ea2d8',
                    glass: 'rgba(255,255,255,0.15)',
                    glassDark: 'rgba(0,0,0,0.25)',
                }
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
