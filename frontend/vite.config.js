import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            // o frontend chama /api/heroes e o Vite repassa para o FastAPI em /heroes
            // (evita configurar CORS no backend durante o desenvolvimento)
            "/api": {
                target: "http://localhost:8000",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
