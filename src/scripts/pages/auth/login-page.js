import { login } from '../../data/api.js';
import { fadeIn } from '../../utils/index.js';

export default class LoginPage {
  async render() {
    return `
      <section class="container" role="main" aria-labelledby="login-title">
        <a href="#main-content" class="skip-link">Skip to content</a>
        <h1 id="login-title">Login</h1>
        <form id="login-form" class="form-container">
          <label for="email">Email:</label>
          <input type="email" id="email" required aria-describedby="email-error">

          <label for="password">Password:</label>
          <input type="password" id="password" required aria-describedby="password-error">
          <button type="button" id="toggle-password">Tampilkan Password</button>
          <div id="password-error" role="alert"></div>

          <button type="submit" class="btn">Login</button>
          <div id="login-message" role="alert"></div>
          <p>Belum punya akun? <a href="#/register">Daftar</a></p>
        </form>
      </section>
    `;
  }

  async afterRender() {
    this.form = document.getElementById('login-form');
    this.bindEvents();
    fadeIn(document.querySelector('.container'));
  }

  bindEvents() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      if (!email || !password) {
        document.getElementById('login-message').textContent = 'Lengkapi form.';
        return;
      }
      try {
        await login({ email, password });
        window.location.hash = '/stories';
      } catch (error) {
        document.getElementById('login-message').textContent = `Error: ${error.message}`;
      }
    });

    document.getElementById('toggle-password').addEventListener('click', () => {
      const pwd = document.getElementById('password');
      pwd.type = pwd.type === 'password' ? 'text' : 'password';
    });
  }
}