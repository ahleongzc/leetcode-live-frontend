import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteStaticCopy({
    targets: [
      {
        src: "manifest.json",
        dest: "."
      },
      {
        src: "icons",
        dest: "."
      },
    ]
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      input: {
        main: './index.html',
        content: './src/content_scripts/content.ts',
        'service-worker': './src/background/service-worker.ts',
        'inject': './src/inject.ts',
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'content') return 'content.js';
          if (chunkInfo.name === 'service-worker') return 'service-worker.js';
          if (chunkInfo.name === 'inject') return 'inject.js';
          return '[name]-[hash].js';
        },
      },
    },
  },
})