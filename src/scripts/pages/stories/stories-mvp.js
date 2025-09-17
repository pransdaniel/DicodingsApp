// src/pages/stories/stories-mvp.js
import StoriesView from './stories-view.js';
import StoriesPresenter from './stories-presenter.js';

export default class StoriesMVP {
  constructor() {
    this.view = new StoriesView();
    this.presenter = new StoriesPresenter(this.view);
  }

  async render() {
    return this.view.render();
  }
}