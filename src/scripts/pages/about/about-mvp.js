// src/pages/about/about-mvp.js
import AboutView from './about-view.js';
import AboutPresenter from './about-presenter.js';

export default class AboutMVP {
  constructor() {
    this.view = new AboutView();
    this.presenter = new AboutPresenter(this.view);
  }

  async render() {
    return this.view.render();
  }
}