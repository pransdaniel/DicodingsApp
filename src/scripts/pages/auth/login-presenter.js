// src/pages/auth/login-presenter.js
import { login } from '../../data/api.js';

export default class LoginPresenter {
  constructor(view) {
    this.view = view;
  }

  async afterRender() {
    this.view.afterRender(this);
  }

  async onSubmit() {
    const { email, password } = this.view.getFormData();
    if (!email || !password) {
      this.view.showMessage('Lengkapi form.', true);
      return;
    }
    try {
      await login({ email, password });
      window.location.hash = '/stories';
    } catch (error) {
      this.view.showMessage(`Error: ${error.message}`, true);
    }
  }
}