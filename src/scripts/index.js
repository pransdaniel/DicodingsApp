// scripts/index.js
// CSS imports
import '../styles/styles.css';

// Leaflet CSS via CDN
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
document.head.appendChild(link);

import App from './pages/app.js';

document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
      // Handle install prompt for PWA
      let deferredPrompt;
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
      });
      // Show install button if needed
      // (Can add a button in home-page to trigger deferredPrompt.prompt())
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // Handle skip to content
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
  }
});