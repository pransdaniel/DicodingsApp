// src/pages/about/about-presenter.js
export default class AboutPresenter {
  constructor(view) {
    this.view = view;
  }

  async afterRender(view) {
    await view.afterRender();
  }
}