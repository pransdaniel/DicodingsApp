// src/pages/stories/stories-view.js
import L from 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/+esm';
import { makeKeyboardAccessible } from '../../utils/index.js';
import { fadeIn } from '../../utils/index.js';

export default class StoriesView {
  constructor() {
    this.map = null;
    this.markers = L.layerGroup();
    this.baseLayers = {
      'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'),
    };
  }

  async render() {
    return `
      <section class="container" role="main" aria-labelledby="stories-title">
        <a href="#main-content" class="skip-link">Skip to content</a>
        <h1 id="stories-title">Daftar Cerita</h1>
        <div class="filter-controls">
          <input type="text" id="search-input" placeholder="Cari cerita..." aria-label="Cari cerita">
          <select id="sort-select" aria-label="Urutkan cerita">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
          <label>
            <input type="checkbox" id="location-filter" checked> Tampilkan dengan lokasi
          </label>
        </div>
        <div class="stories-grid" id="stories-grid" role="list" aria-label="Daftar cerita"></div>
        <div id="map-container" class="map-container" role="region" aria-label="Peta cerita" tabindex="0">
          <div id="map" style="height: 400px;"></div>
          <div id="layer-control"></div>
        </div>
      </section>
    `;
  }

  afterRender(callbacks, stories = []) {
    this.renderStoriesGrid(stories);
    this.initMap();
    this.bindEvents(callbacks);
    makeKeyboardAccessible(document.getElementById('map-container'));
    fadeIn(document.querySelector('.container'));
  }

  renderStoriesGrid(stories) {
    const grid = document.getElementById('stories-grid');
    const sortedStories = this.sortStories(stories, document.getElementById('sort-select').value);
    const filteredStories = this.filterStories(sortedStories);
    grid.innerHTML = filteredStories.map(story => `
      <article class="story-card" role="listitem" tabindex="0" data-id="${story.id}" data-lat="${story.lat}" data-lon="${story.lon}">
        <img src="${story.photoUrl}" alt="${story.description.substring(0, 100)}..." loading="lazy">
        <h2>${story.name}</h2>
        <p>${story.description}</p>
        <time datetime="${story.createdAt}">${story.createdAt}</time> <!-- Use showFormattedDate in presenter -->
      </article>
    `).join('');
  }

  sortStories(stories, sortBy) {
    return [...stories].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }

  filterStories(stories) {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const withLocation = document.getElementById('location-filter').checked;
    return stories.filter(story => 
      story.description.toLowerCase().includes(searchTerm) &&
      (!withLocation || (story.lat && story.lon))
    );
  }

  initMap() {
    this.map = L.map('map').setView([-0.789275, 119.95], 5);
    this.baseLayers['OpenStreetMap'].addTo(this.map);
    L.control.layers(this.baseLayers).addTo(this.map);
    this.markers.addTo(this.map);
  }

  addMarkersToMap(stories) {
    this.markers.clearLayers();
    const filteredStories = this.filterStories(stories);
    filteredStories.forEach(story => {
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
    const card = document.querySelector(`[data-id="${id}"]`);
    if (card) {
      card.classList.add('highlighted');
      card.focus();
    }
  }

  bindEvents(callbacks) {
    // Search and filter
    document.getElementById('search-input').addEventListener('input', () => callbacks.onFilter());
    document.getElementById('sort-select').addEventListener('change', () => callbacks.onFilter());
    document.getElementById('location-filter').addEventListener('change', () => callbacks.onFilter());

    // List-map sync
    document.getElementById('stories-grid').addEventListener('click', (e) => {
      const card = e.target.closest('.story-card');
      if (card) {
        const lat = parseFloat(card.dataset.lat);
        const lon = parseFloat(card.dataset.lon);
        this.map.setView([lat, lon], 10);
        this.highlightStory(card.dataset.id);
      }
    });

    document.getElementById('stories-grid').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const card = e.target.closest('.story-card');
        if (card) {
          card.click();
        }
      }
    });

    // Map keyboard
    document.getElementById('map-container').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.map.invalidateSize();
      }
    });
  }

  updateStories(stories) {
    this.renderStoriesGrid(stories);
    this.addMarkersToMap(stories);
  }
}