import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        screens: {
            tablet: "768px",
            desktop: "1150px",
            "desktop-s": "1250px",
            "desktop-m": "1400px",
            "desktop-l": "1600px",
            "desktop-xl": "1800px",
        },
        extend: {
            aspectRatio: {
                "16/9": "16 / 9",
            },
            dropShadow: {
                "3xl": "0 10px 10px rgba(0, 0, 0, 0.45)",
                "2xl": "0 1px 1px rgba(0, 0, 0, 0.85)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
