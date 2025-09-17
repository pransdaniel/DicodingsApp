// src/utils/index.js
export function showFormattedDate(date, locale = 'id-ID', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 300) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function fadeOut(element, duration = 300) {
  return new Promise((resolve) => {
    element.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`;
    element.style.opacity = '0';
    element.style.transform = 'translateY(10px)';
    setTimeout(resolve, duration);
  });
}

export async function fadeIn(element, duration = 300) {
  element.style.opacity = '0';
  element.style.transform = 'translateY(-10px)';
  element.style.transition = `opacity ${duration}ms ease-in, transform ${duration}ms ease-in`;
  element.style.display = 'block';
  await sleep(10);
  element.style.opacity = '1';
  element.style.transform = 'translateY(0)';
  await sleep(duration);
}

export function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Keyboard navigation helper
export function makeKeyboardAccessible(element) {
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      element.click();
    }
  });
}