import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            "/api": "http://localhost:4000",
        },
    },
    resolve: {
        alias: {
            apis: path.resolve(__dirname, "src/apis"),
            assets: path.resolve(__dirname, "src/assets"),
            components: path.resolve(__dirname, "src/components"),
            contexts: path.resolve(__dirname, "src/contexts"),
            hooks: path.resolve(__dirname, "src/hooks"),
            layouts: path.resolve(__dirname, "src/layouts"),
            styles: path.resolve(__dirname, "src/styles"),
            types: path.resolve(__dirname, "src/types"),
            utils: path.resolve(__dirname, "src/utils"),
            views: path.resolve(__dirname, "src/views"),
        },
    },
});
