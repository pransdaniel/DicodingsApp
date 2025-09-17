// src/pages/add-story/add-story-mvp.js
import AddStoryView from './add-story-view.js';
import AddStoryPresenter from './add-story-presenter.js';

export default class AddStoryMVP {
  constructor() {
    this.view = new AddStoryView();
    this.presenter = new AddStoryPresenter(this.view);
  }

  async render() {
    return this.view.render();
  }
}