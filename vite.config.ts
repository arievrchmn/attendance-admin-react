import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import mkcert from 'vite-plugin-mkcert';
import firebaseServiceWorkerPlugin from './vite-plugin-firebase-sw';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 4100,
  },
  plugins: [
    firebaseServiceWorkerPlugin(),
    mkcert(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss(),
  ],
});
