// src/pages/auth/register-mvp.js
import RegisterView from './register-view.js';
import RegisterPresenter from './register-presenter.js';

export default class RegisterMVP {
  constructor() {
    this.view = new RegisterView();
    this.presenter = new RegisterPresenter(this.view);
  }

  async render() {
    return this.view.render();
  }
}