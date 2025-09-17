import { getStories } from '../../data/api.js';
import { showFormattedDate } from '../../utils/index.js';
import { fadeIn } from '../../utils/index.js';
import L from 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/+esm'; // Leaflet via CDN

export default class StoriesPage {
  constructor() {
    this.map = null;
    this.markers = L.layerGroup();
    this.baseLayers = {
      'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      'OpenTopoMap': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'),
    };
    this.stories = [];
  }

  async render() {
    return `
      <section class="container" role="main" aria-labelledby="stories-title">
        <a href="#main-content" class="skip-link">Skip to content</a>
        <h1 id="stories-title">Daftar Cerita</h1>
        <div class="stories-grid" id="stories-grid" role="list" aria-label="Daftar cerita"></div>
        <div id="map-container" class="map-container" role="region" aria-label="Peta cerita" tabindex="0">
          <div id="map" style="height: 400px;"></div>
          <div id="layer-control"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    await this.loadStories();
    this.initMap();
    this.bindEvents();
    fadeIn(document.querySelector('.container'));
  }

  async loadStories() {
    try {
      const { listStory } = await getStories(1, 10, 1);
      this.stories = listStory;
      this.renderStoriesGrid();
      this.addMarkersToMap();
    } catch (error) {
      console.error(error);
      document.getElementById('stories-grid').innerHTML = '<p>Failed to load stories.</p>';
    }
  }

  renderStoriesGrid() {
    const grid = document.getElementById('stories-grid');
    grid.innerHTML = this.stories.map(story => `
      <article class="story-card" role="listitem" tabindex="0" data-lat="${story.lat}" data-lon="${story.lon}">
        <img src="${story.photoUrl}" alt="${story.description.substring(0, 100)}..." loading="lazy">
        <h2>${story.name}</h2>
        <p>${story.description}</p>
        <time datetime="${story.createdAt}">${showFormattedDate(story.createdAt)}</time>
      </article>
    `).join('');
  }

  initMap() {
    this.map = L.map('map').setView([-0.789275, 119.95], 5);
    this.baseLayers['OpenStreetMap'].addTo(this.map);
    L.control.layers(this.baseLayers).addTo(this.map);
    this.markers.addTo(this.map);
  }

  addMarkersToMap() {
    this.markers.clearLayers();
    this.stories.forEach(story => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).bindPopup(`
          <b>${story.name}</b><br>
          ${story.description}<br>
          <img src="${story.photoUrl}" alt="${story.description}" style="max-width:100px;">
        `);
        marker.addTo(this.markers);
        marker.on('click', () => this.highlightStory(story.id));
      }
    });
  }

  highlightStory(id) {
    document.querySelectorAll('.story-card').forEach(card => card.classList.remove('highlighted'));
    const card = document.querySelector(`[data-id="${id}"]`); // Assume data-id added if needed
    if (card) card.classList.add('highlighted');
    this.map.setView([parseFloat(card.dataset.lat), parseFloat(card.dataset.lon)], 10);
  }

  bindEvents() {
    // List-map sync
    document.getElementById('stories-grid').addEventListener('click', (e) => {
      const card = e.target.closest('.story-card');
      if (card) {
        const lat = parseFloat(card.dataset.lat);
        const lon = parseFloat(card.dataset.lon);
        this.map.setView([lat, lon], 10);
      }
    });

    // Keyboard nav for map
    document.getElementById('map-container').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.map.invalidateSize();
      }
    });
  }
}