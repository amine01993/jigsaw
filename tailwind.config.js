/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{ts,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [
        plugin(function ({ addVariant }) {
            addVariant("pointer-coarse", "@media (pointer: coarse)");
        }),
    ],
};
