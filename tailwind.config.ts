import type { Config } from "tailwindcss";

// Colours, type and radii come from the Prism Glass tokens in app/globals.css;
// the glass components themselves live in app/prism.css.
export default {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        rounded: ["var(--font-rounded)"],
        serif: ["var(--font-serif)"],
        gummy: ["var(--font-gummy)"],
      },
      colors: {
        wall: "var(--wall)",
        label: {
          DEFAULT: "var(--label)",
          2: "var(--label-2)",
          3: "var(--label-3)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          pink: "var(--accent-pink)",
        },
        separator: "var(--separator)",
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
    },
  },
  plugins: [],
} satisfies Config;
