// src/utils/network.js (new utility for online check)
export async function isOnline() {
  return navigator.onLine;
}

window.addEventListener('online', () => {
  // Trigger sync if needed, e.g., in app.js or presenters
  console.log('Back online');
});

window.addEventListener('offline', () => {
  console.log('Offline');
});