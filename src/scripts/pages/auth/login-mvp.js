// src/pages/auth/login-mvp.js
import LoginView from './login-view.js';
import LoginPresenter from './login-presenter.js';

export default class LoginMVP {
  constructor() {
    this.view = new LoginView();
    this.presenter = new LoginPresenter(this.view);
  }

  async render() {
    return this.view.render();
  }
}