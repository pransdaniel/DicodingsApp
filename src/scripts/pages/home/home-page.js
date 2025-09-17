import { isAuthenticated } from '../../data/api.js';

export default class HomePage {
  async render() {
    const authStatus = isAuthenticated() ? 'sudah login' : 'belum login';
    return `
      <section class="container" role="main" aria-labelledby="home-title">
        <a href="#main-content" class="skip-link">Skip to content</a>
        <h1 id="home-title">Selamat Datang di Dicoding Story</h1>
        <p>Bagikan cerita Anda! ${authStatus ? `Anda ${authStatus}.` : 'Silakan login atau lanjut sebagai guest.'}</p>
        <div class="home-actions">
          <a href="#/stories" class="btn">Lihat Cerita</a>
          <a href="#/add-story" class="btn ${!isAuthenticated() ? 'disabled' : ''}">Tambah Cerita</a>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Handle auth redirect if needed
    if (!isAuthenticated()) {
      document.querySelector('.home-actions .btn:last-child')?.setAttribute('aria-disabled', 'true');
    }
  }
}