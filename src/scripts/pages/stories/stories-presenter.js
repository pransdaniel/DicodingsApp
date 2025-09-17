// src/pages/stories/stories-presenter.js
import { getStories, isAuthenticated } from '../../data/api.js';
import { showFormattedDate } from '../../utils/index.js';

export default class StoriesPresenter {
  constructor(view) {
    this.view = view;
    this.stories = [];
  }

  async afterRender() {
    if (!isAuthenticated()) {
      window.location.hash = '/login';
      return;
    }
    await this.loadStories();
    this.view.afterRender(this, this.stories);
  }

  async loadStories() {
    try {
      const { listStory } = await getStories(1, 10, 1);
      this.stories = listStory.map(story => ({
        ...story,
        formattedDate: showFormattedDate(story.createdAt)
      }));
      this.view.updateStories(this.stories);
    } catch (error) {
      console.error(error);
      document.getElementById('stories-grid').innerHTML = '<p>Failed to load stories.</p>';
    }
  }

  onFilter() {
    this.view.renderStoriesGrid(this.stories);
    this.view.addMarkersToMap(this.stories);
  }
}