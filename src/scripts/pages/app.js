// src/pages/app.js
import routes from '../routes/routes.js';
import { fadeOut, fadeIn } from '../utils/index.js';
import { isAuthenticated } from '../data/api.js';

export default class App {
  constructor({ content, drawerButton, navigationDrawer }) {
    this.content = content;
    this.drawerButton = drawerButton;
    this.navigationDrawer = navigationDrawer;
    this.currentView = null;
    this.initNavigation();
    this.updateNavAuthState();
  }

  async renderPage() {
    const activeRoute = this.getActiveRoute();
    const pageInstance = routes[activeRoute];
    if (!pageInstance) return;

    if (this.currentView) {
      await fadeOut(this.currentView);
      this.currentView.remove();
    }

    const view = await pageInstance.view.render();
    this.content.innerHTML = view;
    this.currentView = this.content.querySelector('.container');
    await fadeIn(this.currentView);

    // Focus on main content for accessibility
    this.content.focus();

    await pageInstance.presenter.afterRender(pageInstance.view);
  }

  getActiveRoute() {
    return location.hash.slice(1) || '/';
  }

  initNavigation() {
    this.drawerButton.addEventListener('click', () => {
      this.navigationDrawer.classList.toggle('open');
      this.drawerButton.setAttribute('aria-expanded', this.navigationDrawer.classList.contains('open'));
    });

    // Close drawer on route change
    window.addEventListener('hashchange', () => {
      this.navigationDrawer.classList.remove('open');
      this.drawerButton.setAttribute('aria-expanded', 'false');
    });

    // Logout handler
    document.getElementById('logout-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      import('../data/api.js').then(({ logout }) => {
        logout();
        window.location.hash = '/';
        this.updateNavAuthState();
      });
    });
  }

  updateNavAuthState() {
    const addStoryLink = document.querySelector('a[href="#/add-story"]');
    const loginLink = document.querySelector('a[href="#/login"]');
    const registerLink = document.querySelector('a[href="#/register"]');
    const logoutLink = document.getElementById('logout-link');

    if (isAuthenticated()) {
      addStoryLink.style.display = 'block';
      loginLink.style.display = 'none';
      registerLink.style.display = 'none';
      logoutLink.style.display = 'block';
    } else {
      addStoryLink.style.display = 'none';
      loginLink.style.display = 'block';
      registerLink.style.display = 'block';
      logoutLink.style.display = 'none';
    }
  }
}