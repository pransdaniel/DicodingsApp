// src/pages/home/home-mvp.js
import HomeView from './home-view.js';
import HomePresenter from './home-presenter.js';
import CONFIG from '../../config.js';

export default class HomeMVP {
  constructor() {
    this.view = new HomeView();
    this.presenter = new HomePresenter(this.view);
  }

  async render() {
    return this.view.render();
  }
}