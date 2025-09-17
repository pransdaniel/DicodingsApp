// src/pages/add-story/add-story-view.js
import L from 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/+esm';
import { makeKeyboardAccessible } from '../../utils/index.js';

export default class AddStoryView {
  constructor() {
    this.map = null;
    this.selectedLat = null;
    this.selectedLon = null;
    this.stream = null;
    this.video = null;
    this.canvas = null;
  }

  async render() {
    return `
      <section class="container" role="main" aria-labelledby="add-title">
        <a href="#main-content" class="skip-link">Skip to content</a>
        <h1 id="add-title">Tambah Cerita Baru</h1>
        <form id="add-story-form" class="form-container">
          <label for="description">Deskripsi:</label>
          <textarea id="description" required aria-describedby="desc-error" maxlength="200"></textarea>
          <div id="desc-error" role="alert"></div>

          <label for="photo">Foto:</label>
          <input type="file" id="photo" accept="image/*" aria-describedby="photo-error">
          <button type="button" id="camera-btn" tabindex="0">Ambil dari Kamera</button>
          <video id="video" style="display:none;" autoplay muted></video>
          <canvas id="canvas" style="display:none;"></canvas>
          <div id="photo-error" role="alert"></div>

          <label>Klik peta untuk pilih lokasi:</label>
          <div id="map-container" class="map-container" style="height:300px;" role="region" aria-label="Pilih lokasi" tabindex="0"></div>

          <button type="submit" class="btn" tabindex="0">Kirim Cerita</button>
          <div id="form-message" role="alert"></div>
        </form>
      </section>
    `;
  }

  afterRender() {
    this.form = document.getElementById('add-story-form');
    this.initMap();
    this.initCamera();
    makeKeyboardAccessible(document.getElementById('camera-btn'));
    makeKeyboardAccessible(document.getElementById('map-container'));
    makeKeyboardAccessible(this.form.querySelector('button[type="submit"]'));
  }

  initMap() {
    this.map = L.map('map-container').setView([-0.789275, 119.95], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    this.map.on('click', (e) => {
      this.selectedLat = e.latlng.lat;
      this.selectedLon = e.latlng.lng;
      L.marker([this.selectedLat, this.selectedLon]).addTo(this.map).bindPopup('Lokasi dipilih').openPopup();
    });
  }

  initCamera() {
    this.video = document.getElementById('video');
    this.canvas = document.getElementById('canvas');
    this.cameraBtn = document.getElementById('camera-btn');
    this.cameraBtn.addEventListener('click', () => this.startCamera());
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video.srcObject = this.stream;
      this.video.style.display = 'block';
      this.cameraBtn.textContent = 'Hentikan Kamera';
      const captureBtn = document.createElement('button');
      captureBtn.textContent = 'Ambil Foto';
      captureBtn.type = 'button';
      captureBtn.tabIndex = 0;
      makeKeyboardAccessible(captureBtn);
      this.form.appendChild(captureBtn);
      captureBtn.addEventListener('click', () => this.capturePhoto());
    } catch (error) {
      document.getElementById('photo-error').textContent = 'Kamera tidak tersedia.';
    }
  }

  capturePhoto() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    this.canvas.getContext('2d').drawImage(this.video, 0, 0);
    this.canvas.toBlob((blob) => {
      const file = new File([blob], 'captured.jpg', { type: 'image/jpeg' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      document.getElementById('photo').files = dataTransfer.files;
    });
    this.stopCamera();
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.video.style.display = 'none';
    this.canvas.style.display = 'none';
    this.cameraBtn.textContent = 'Ambil dari Kamera';
  }

  getFormData() {
    const description = document.getElementById('description').value;
    const photoInput = document.getElementById('photo');
    return {
      description,
      photo: photoInput.files[0] || null,
      lat: this.selectedLat,
      lon: this.selectedLon,
    };
  }

  showMessage(message, isError = false) {
    const msgEl = document.getElementById('form-message');
    msgEl.textContent = message;
    msgEl.className = isError ? 'error' : 'success';
  }

  resetForm() {
    this.form.reset();
    this.stopCamera();
    if (this.map) {
      this.map.eachLayer(layer => { if (layer instanceof L.Marker) this.map.removeLayer(layer); });
    }
    this.selectedLat = null;
    this.selectedLon = null;
  }

  bindEvents(callbacks) {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      callbacks.onSubmit();
    });

    document.getElementById('description').addEventListener('input', (e) => {
      if (e.target.value.length < 5) {
        document.getElementById('desc-error').textContent = 'Deskripsi minimal 5 karakter.';
      } else {
        document.getElementById('desc-error').textContent = '';
      }
    });

    document.getElementById('map-container').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const center = this.map.getCenter();
        this.selectedLat = center.lat;
        this.selectedLon = center.lng;
        L.marker([this.selectedLat, this.selectedLon]).addTo(this.map).bindPopup('Lokasi dipilih').openPopup();
      }
    });
  }
}