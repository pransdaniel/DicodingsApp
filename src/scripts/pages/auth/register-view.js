// src/pages/auth/register-view.js
import { fadeIn } from '../../utils/index.js';
import { makeKeyboardAccessible } from '../../utils/index.js';

export default class RegisterView {
  async render() {
    return `
      <section class="container" role="main" aria-labelledby="register-title">
        <a href="#main-content" class="skip-link">Skip to content</a>
        <h1 id="register-title">Daftar</h1>
        <form id="register-form" class="form-container">
          <label for="name">Nama:</label>
          <input type="text" id="name" required aria-describedby="name-error" tabindex="0">

          <label for="email">Email:</label>
          <input type="email" id="email" required aria-describedby="email-error" tabindex="0">

          <label for="password">Password (min 8 char):</label>
          <input type="password" id="password" required minlength="8" aria-describedby="password-error" tabindex="0">
          <div id="password-error" role="alert"></div>

          <button type="submit" class="btn" tabindex="0">Daftar</button>
          <div id="register-message" role="alert"></div>
          <p>Sudah punya akun? <a href="#/login" tabindex="0">Login</a></p>
        </form>
      </section>
    `;
  }

  afterRender(callbacks) {
    this.form = document.getElementById('register-form');
    this.bindEvents(callbacks);
    makeKeyboardAccessible(this.form.querySelector('button[type="submit"]'));
    fadeIn(document.querySelector('.container'));
  }

  bindEvents(callbacks) {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      callbacks.onSubmit();
    });
  }

  getFormData() {
    return {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    };
  }

  showMessage(message, isError = false) {
    const msgEl = document.getElementById('register-message');
    msgEl.textContent = message;
    msgEl.className = isError ? 'error' : 'success';
  }
}