// src/pages/auth/register-presenter.js
import { register } from '../../data/api.js';

export default class RegisterPresenter {
  constructor(view) {
    this.view = view;
  }

  async afterRender() {
    this.view.afterRender(this);
  }

  async onSubmit() {
    const { name, email, password } = this.view.getFormData();
    if (password.length < 8) {
      document.getElementById('password-error').textContent = 'Password minimal 8 karakter.';
      return;
    }
    try {
      await register({ name, email, password });
      this.view.showMessage('Daftar berhasil! Silakan login.');
      window.location.hash = '/login';
    } catch (error) {
      this.view.showMessage(`Error: ${error.message}`, true);
    }
  }
}