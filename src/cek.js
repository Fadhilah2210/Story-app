import {
  generateLoaderAbsoluteTemplate,
  generateStoryListEmptyTemplate,
  generateStoryListErrorTemplate,
} from '../../template.js';
import HomePresenter from './homePresenter.js';
import * as StoryAPI from '../../api/storyApi.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

export default class HomePage {
  #presenter = null;
  #stories = [];
  #mapInstance = null;

  async render() {
    document.getElementById('main-content')?.classList.add('home-page');

    return `
      <section class="story-list">
        <h2>Daftar Cerita</h2>
        <div id="stories-list-loading-container"></div>
        <div id="stories-list" class="stories-list"></div>
        <div id="map-loading-container"></div>
        <div id="map" style="height: 400px; margin-top: 1rem;"></div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });
    await this.#presenter.initialGalleryAndMap();

  populateStoriesList(message, stories) {
    this.#stories = stories;
    this.hideLoading();

    if (!stories || stories.length === 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const html = stories
          .map((story) =>
            generateStoryItemTemplate({
              id: story.id,
              photoUrl: story.photoUrl,
              description: story.description,
              name: story.name,
              createdAt: story.createdAt,
              lat: story.lat,
              lon: story.lon,
            })
          )
          .join('');
    
        document.getElementById('stories-list').innerHTML = html;
      }

  populateStoriesListEmpty() {
    this.hideLoading();
    document.getElementById('stories-list').innerHTML = generateStoryListEmptyTemplate();
  }

  populateStoriesListError(message) {
    this.hideLoading();
    document.getElementById('stories-list').innerHTML = generateStoryListErrorTemplate(message);
  }

  showMapLoading() {
    const loader = document.getElementById('map-loading-container');
    loader.innerHTML = generateLoaderAbsoluteTemplate();
    loader.style.display = 'flex';
  }

  hideMapLoading() {
    const loader = document.getElementById('map-loading-container');
    loader.style.display = 'none';
    loader.innerHTML = '';
  }

  showLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }

  initialMap(stories) {
    this.hideMapLoading();

    const mapContainer = document.getElementById('map');
    if (mapContainer._leaflet_id != null) {
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = '';
    }

    const map = L.map('map').setView(
      stories.length > 0 ? [stories[0].lat, stories[0].lon] : [-2.5489, 118.0149],
      5
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; OpenStreetMap contributors',
    }).addTo(map);

    stories.forEach((story) => {
      if (story.lat != null && story.lon != null) {
        L.marker([story.lat, story.lon]).addTo(map)
          .bindPopup(`<strong>${story.name}</strong><br>${story.description}`);
      }
    });

    this.#mapInstance = map;
  }
}
