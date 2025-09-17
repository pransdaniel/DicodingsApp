// src/pages/home/home-view.js
import { isAuthenticated } from '../../data/api.js';
import { fadeIn } from '../../utils/index.js';
import { makeKeyboardAccessible } from '../../utils/index.js';

export default class HomeView {
  async render() {
    const authStatus = isAuthenticated() ? 'sudah login' : 'belum login';
    return `
      <section class="container" role="main" aria-labelledby="home-title">
        <a href="#main-content" class="skip-link">Skip to content</a>
        <h1 id="home-title">Selamat Datang di Dicoding Story</h1>
        <p>Bagikan cerita Anda! ${authStatus ? `Anda ${authStatus}.` : 'Silakan login atau lanjut sebagai guest.'}</p>
        <div class="home-actions">
          <a href="#/stories" class="btn" tabindex="0">Lihat Cerita</a>
          <a href="#/add-story" class="btn ${!isAuthenticated() ? 'disabled' : ''}" tabindex="${isAuthenticated() ? 0 : -1}">Tambah Cerita</a>
          <button id="toggle-push" class="btn" tabindex="0">Aktifkan Notifikasi</button>
        </div>
      </section>
    `;
  }

  afterRender(callbacks) {
    if (!isAuthenticated()) {
      document.querySelector('.home-actions .btn:nth-child(2)')?.setAttribute('aria-disabled', 'true');
    }
    const toggleBtn = document.getElementById('toggle-push');
    makeKeyboardAccessible(toggleBtn);
    toggleBtn.addEventListener('click', () => callbacks.onTogglePush());
    fadeIn(document.querySelector('.container'));
  }

  updateToggleButton(text) {
    document.getElementById('toggle-push').textContent = text;
  }
}