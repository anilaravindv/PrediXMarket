module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                "sky-blue": "#0079CC",
                "light-black": "#272727",
                navy: "#013070",
                black: "#272727",
            },
        },
        screens: {
            xs: "320px",
            sm: "640px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
            "max-sm": { max: "639px" },
            "max-md": { max: "767px" },
            "max-lg": { max: "1023px" },
            "max-xl": { max: "1279px" },
            "max-2xl": { max: "1535px" },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
