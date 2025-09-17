// src/data/api.js
import CONFIG from '../config.js';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORIES_GUEST: `${CONFIG.BASE_URL}/stories/guest`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  SUBSCRIBE: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

const API_HEADERS = {
  'Content-Type': 'application/json',
};

export async function register({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: API_HEADERS,
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) throw new Error('Registration failed');
  return await response.json();
}

export async function login({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: API_HEADERS,
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  if (data.loginResult?.token) {
    localStorage.setItem('token', data.loginResult.token);
  }
  return data;
}

export async function getStories(page = 1, size = 10, withLocation = 1) {
  const token = localStorage.getItem('token');
  const headers = { ...API_HEADERS };
  if (token) headers.Authorization = `Bearer ${token}`;
  const params = new URLSearchParams({ page, size, location: withLocation });
  const response = await fetch(`${ENDPOINTS.STORIES}?${params}`, { headers });
  if (!response.ok) throw new Error('Failed to fetch stories');
  return await response.json();
}

export async function addStory({ description, photo, lat, lon }, isGuest = false) {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('description', description);
  if (photo) formData.append('photo', photo);
  if (lat && lon) {
    formData.append('lat', lat);
    formData.append('lon', lon);
  }
  const headers = {};
  if (!isGuest && token) headers.Authorization = `Bearer ${token}`;
  const endpoint = isGuest ? ENDPOINTS.STORIES_GUEST : ENDPOINTS.STORIES;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to add story');
  const data = await response.json();
  // Assume API returns story ID; if not, generate locally
  data.storyId = Date.now().toString(); // Placeholder
  return data;
}

export async function subscribePush(endpoint, keys) {
  const token = localStorage.getItem('token');
  const response = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      ...API_HEADERS,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ endpoint, keys: { p256dh: keys.p256dh, auth: keys.auth } }),
  });
  if (!response.ok) throw new Error('Failed to subscribe');
  return await response.json();
}

export async function unsubscribePush(endpoint) {
  const token = localStorage.getItem('token');
  const response = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'DELETE',
    headers: {
      ...API_HEADERS,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ endpoint }),
  });
  if (!response.ok) throw new Error('Failed to unsubscribe');
  return await response.json();
}

export function logout() {
  localStorage.removeItem('token');
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}