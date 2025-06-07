// src/pages/detail/detailView.js
import { generateStoryDetailTemplate, generateLoaderAbsoluteTemplate } from '../../template.js';
import { parseActivePathname } from '../../routes/url-parser.js';
import detailPresenter from './detailPresenter.js';
import * as StoryAPI from '../../api/storyApi.js';
import L from 'leaflet';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { saveStoryToOffline } from '../../utils/idb.js';

export default class StoryDetailPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <div id="story-detail-container">
          <div id="story-detail"></div>
          <div id="loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const { id } = parseActivePathname();
    this.#presenter = new detailPresenter({
      view: this,
      model: StoryAPI,
      storyId: id,
    });
    await this.#presenter.showStoryDetail();
  }

  showLoading() {
    document.getElementById('loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('loading-container').innerHTML = '';
  }

  showStoryDetail(story) {
    const container = document.getElementById('story-detail');
    container.innerHTML = `
      ${generateStoryDetailTemplate(story)}
      <button id="save-offline-btn" style="margin-top: 1rem;">Simpan Offline</button>
    `;

    const saveBtn = document.getElementById('save-offline-btn');
    saveBtn.addEventListener('click', async () => {
      try {
        await saveStoryToOffline(story);
        alert('Cerita berhasil disimpan untuk offline!');
      } catch (err) {
        alert('Gagal menyimpan cerita: ' + err.message);
      }
    });

    if (story.lat !== undefined && story.lon !== undefined) {
      setTimeout(() => {
        this.initMap(story.lat, story.lon);
      }, 0);
    }
  }

  async initMap(lat, lon) {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    mapContainer.style.height = '300px';

    const map = L.map(mapContainer).setView([lat, lon], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    const markerIcon = L.icon({
      iconUrl: markerIconUrl,
      shadowUrl: markerShadowUrl,
    });

    try {
      const locationName = await reverseGeocode(lat, lon);

      L.marker([lat, lon], { icon: markerIcon }).addTo(map).bindPopup(`Lokasi: ${locationName}`).openPopup();
    } catch (error) {
      L.marker([lat, lon], { icon: markerIcon }).addTo(map).bindPopup('Lokasi tidak dikenal').openPopup();
    }
  }

  showError(message) {
    document.getElementById('story-detail').innerHTML = `
      <div class="error-message">${message || 'Failed to load story'}</div>
    `;
  }
}

async function reverseGeocode(lat, lon) {
  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
  if (!response.ok) throw new Error('Gagal mendapatkan nama lokasi');

  const data = await response.json();
  return data.display_name || 'Lokasi tidak dikenal';
}
