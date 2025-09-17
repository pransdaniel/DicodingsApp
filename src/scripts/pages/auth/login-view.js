// src/pages/auth/login-view.js
import { fadeIn } from '../../utils/index.js';
import { makeKeyboardAccessible } from '../../utils/index.js';

export default class LoginView {
  async render() {
    return `
      <section class="container" role="main" aria-labelledby="login-title">
        <a href="#main-content" class="skip-link">Skip to content</a>
        <h1 id="login-title">Login</h1>
        <form id="login-form" class="form-container">
          <label for="email">Email:</label>
          <input type="email" id="email" required aria-describedby="email-error" tabindex="0">

          <label for="password">Password:</label>
          <input type="password" id="password" required aria-describedby="password-error" tabindex="0">
          <button type="button" id="toggle-password" tabindex="0">Tampilkan Password</button>
          <div id="password-error" role="alert"></div>

          <button type="submit" class="btn" tabindex="0">Login</button>
          <div id="login-message" role="alert"></div>
          <p>Belum punya akun? <a href="#/register" tabindex="0">Daftar</a></p>
        </form>
      </section>
    `;
  }

  afterRender(callbacks) {
    this.form = document.getElementById('login-form');
    this.bindEvents(callbacks);
    makeKeyboardAccessible(document.getElementById('toggle-password'));
    makeKeyboardAccessible(this.form.querySelector('button[type="submit"]'));
    fadeIn(document.querySelector('.container'));
  }

  bindEvents(callbacks) {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      callbacks.onSubmit();
    });

    document.getElementById('toggle-password').addEventListener('click', () => {
      const pwd = document.getElementById('password');
      pwd.type = pwd.type === 'password' ? 'text' : 'password';
    });
  }

  getFormData() {
    return {
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
    };
  }

  showMessage(message, isError = false) {
    const msgEl = document.getElementById('login-message');
    msgEl.textContent = message;
    msgEl.className = isError ? 'error' : 'success';
  }
}