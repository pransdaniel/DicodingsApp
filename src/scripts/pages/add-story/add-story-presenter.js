// src/pages/add-story/add-story-presenter.js
import { addStory, isAuthenticated } from '../../data/api.js';
import { storyDB } from '../../data/db.js';
import { fadeIn } from '../../utils/index.js';
import { isOnline } from '../../utils/network.js'; // Assume utility for online check

export default class AddStoryPresenter {
  constructor(view) {
    this.view = view;
    this.isSubscribed = false;
  }

  async afterRender() {
    if (!isAuthenticated()) {
      window.location.hash = '/login';
      return;
    }
    this.view.afterRender();
    this.view.bindEvents(this);
    this.checkSubscription();
    await fadeIn(document.querySelector('.container'));
  }

  async checkSubscription() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      this.isSubscribed = !!subscription;
    }
  }

  async onSubmit() {
    const formData = this.view.getFormData();
    if (!formData.description || formData.description.length < 5 || !formData.photo) {
      this.view.showMessage('Lengkapi form dengan valid.', true);
      return;
    }

    try {
      let response;
      if (await isOnline()) {
        response = await addStory(formData, false);
        this.view.showMessage('Cerita berhasil ditambahkan!');
        if (this.isSubscribed) {
          const registration = await navigator.serviceWorker.ready;
          registration.active.postMessage({
            type: 'PUSH_NOTIFICATION',
            data: {
              title: 'Story berhasil dibuat',
              options: { body: `Anda telah membuat story baru dengan deskripsi: ${formData.description}` },
              storyId: response.storyId
            }
          });
        }
      } else {
        const id = await storyDB.addStory(formData);
        this.view.showMessage('Cerita disimpan offline, akan disinkronkan saat online.');
      }
      this.view.resetForm();
      this.syncOfflineStories();
    } catch (error) {
      this.view.showMessage(`Error: ${error.message}`, true);
    }
  }

  async syncOfflineStories() {
    if (!await isOnline()) return;
    const offlineStories = await storyDB.getAllStories();
    for (const story of offlineStories) {
      try {
        await addStory(story, false);
        await storyDB.deleteStory(story.id);
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }
}