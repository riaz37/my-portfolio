/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        text: "var(--text)",
        primary: {
          DEFAULT: "var(--primary)",
          text: "var(--primary-text)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          text: "var(--secondary-text)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          text: "var(--destructive-text)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          text: "var(--muted-text)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          text: "var(--accent-text)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          text: "var(--popover-text)",
        },
        card: {
          DEFAULT: "var(--card)",
          text: "var(--card-text)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-jetbrains-mono)'],
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
