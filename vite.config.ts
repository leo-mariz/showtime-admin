import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";
import babel from 'vite-plugin-babel';


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    babel({
      babelConfig: {
        plugins: [
          ["@babel/plugin-proposal-decorators", { "legacy": true }],
          ["@babel/plugin-transform-class-properties", { "loose": true }]
        ]
      }
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
