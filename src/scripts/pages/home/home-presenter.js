// src/pages/home/home-presenter.js
import { isAuthenticated, subscribePush, unsubscribePush } from '../../data/api.js';
import { urlBase64ToUint8Array } from '../../utils/index.js';

export default class HomePresenter {
  constructor(view) {
    this.view = view;
    this.isSubscribed = false;
  }

  async afterRender() {
    this.view.afterRender(this);
    await this.checkSubscription();
  }

  async checkSubscription() {
    if (!isAuthenticated() || !('serviceWorker' in navigator)) return;
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    this.isSubscribed = !!subscription;
    this.view.updateToggleButton(this.isSubscribed ? 'Nonaktifkan Notifikasi' : 'Aktifkan Notifikasi');
  }

  async onTogglePush() {
    if (!isAuthenticated()) return;
    const registration = await navigator.serviceWorker.ready;
    if (this.isSubscribed) {
      const subscription = await registration.pushManager.getSubscription();
      await unsubscribePush(subscription.endpoint);
      await subscription.unsubscribe();
    } else {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY)
      });
      await subscribePush(subscription.endpoint, subscription.toJSON().keys);
    }
    this.isSubscribed = !this.isSubscribed;
    this.view.updateToggleButton(this.isSubscribed ? 'Nonaktifkan Notifikasi' : 'Aktifkan Notifikasi');
  }
}