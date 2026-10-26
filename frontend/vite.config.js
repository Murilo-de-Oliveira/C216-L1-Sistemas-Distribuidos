import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: "./tests/setup.js",
        include: [
            "tests/unit/**/*.test.{js,jsx}",
            "tests/integration/**/*.test.{js,jsx}",
        ],
    },
});