import { register } from '../../data/api.js';
import { fadeIn } from '../../utils/index.js';

export default class RegisterPage {
  async render() {
    return `
      <section class="container" role="main" aria-labelledby="register-title">
        <a href="#main-content" class="skip-link">Skip to content</a>
        <h1 id="register-title">Daftar</h1>
        <form id="register-form" class="form-container">
          <label for="name">Nama:</label>
          <input type="text" id="name" required aria-describedby="name-error">

          <label for="email">Email:</label>
          <input type="email" id="email" required aria-describedby="email-error">

          <label for="password">Password (min 8 char):</label>
          <input type="password" id="password" required minlength="8" aria-describedby="password-error">
          <div id="password-error" role="alert"></div>

          <button type="submit" class="btn">Daftar</button>
          <div id="register-message" role="alert"></div>
          <p>Sudah punya akun? <a href="#/login">Login</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.form = document.getElementById('register-form');
    this.bindEvents();
    fadeIn(document.querySelector('.container'));
  }

  bindEvents() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      if (password.length < 8) {
        document.getElementById('password-error').textContent = 'Password minimal 8 karakter.';
        return;
      }
      try {
        await register({ name, email, password });
        document.getElementById('register-message').textContent = 'Daftar berhasil! Silakan login.';
        window.location.hash = '/login';
      } catch (error) {
        document.getElementById('register-message').textContent = `Error: ${error.message}`;
      }
    });
  }
}