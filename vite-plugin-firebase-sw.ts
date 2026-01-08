import type { Plugin } from 'vite';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

/**
 * Vite plugin to generate Firebase Messaging Service Worker with environment variables
 */
export default function firebaseServiceWorkerPlugin(): Plugin {
  return {
    name: 'firebase-service-worker',

    configResolved(config) {
      const isDev = config.command === 'serve';
      const templatePath = resolve(config.root, 'src/firebase-messaging-sw.template.js');
      const outputPath = resolve(config.root, 'public/firebase-messaging-sw.js');

      // Only generate if template exists
      if (!existsSync(templatePath)) {
        console.warn('⚠️  Firebase SW template not found:', templatePath);
        return;
      }

      // Read template
      const template = readFileSync(templatePath, 'utf-8');

      // Get environment variables
      const env = config.env;

      // Replace placeholders with actual values
      const content = template
        .replace('__FIREBASE_API_KEY__', env.VITE_FIREBASE_API_KEY || '')
        .replace('__FIREBASE_AUTH_DOMAIN__', env.VITE_FIREBASE_AUTH_DOMAIN || '')
        .replace('__FIREBASE_PROJECT_ID__', env.VITE_FIREBASE_PROJECT_ID || '')
        .replace('__FIREBASE_STORAGE_BUCKET__', env.VITE_FIREBASE_STORAGE_BUCKET || '')
        .replace('__FIREBASE_MESSAGING_SENDER_ID__', env.VITE_FIREBASE_MESSAGING_SENDER_ID || '')
        .replace('__FIREBASE_APP_ID__', env.VITE_FIREBASE_APP_ID || '');

      // Write to public folder
      writeFileSync(outputPath, content, 'utf-8');

      const mode = isDev ? '🔧 Development' : '🏗️  Build';
      console.log(`${mode} - Firebase Service Worker generated at: ${outputPath}`);
    },
  };
}