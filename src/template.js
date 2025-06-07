import { showFormattedDate } from './utils/index.js';

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li><a href="#/">Home</a></li>
    <li><a id="new-story-button" class="btn new-story-button" href="#/new">Buat Cerita <i class="fas fa-plus"></i></a></li>
    <li><button id="logout-button" class="btn new-story-button" type="button"><i class="fas fa-sign-out-alt"></i> Logout</button></li>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateMainNavigationListTemplate() {
  return ``;
}

export function generateStoryListEmptyTemplate() {
  return `
    <div id="story-list-empty" class="story-list__empty">
      <h2>Tidak ada cerita yang tersedia</h2>
      <p>Saat ini, tidak ada cerita dapat ditampilkan.</p>
    </div>
  `;
}

export function generateStoryListErrorTemplate(message) {
  return `
    <div id="story-list-error" class="story-list__error">
      <h2>Terjadi kesalahan pengambilan daftar cerita</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateStoryDetailErrorTemplate(message) {
  return `
    <div id="story-detail-error" class="story-detail__error">
      <h2>Terjadi kesalahan pengambilan detail cerita</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateStoryItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
}) {
  return `
    <div class="story-card">
      <img src="${photoUrl}" alt="Gambar oleh ${name}" class="story-image" />
      <div class="story-content">
        <h3>${name}</h3>
        <p class="story-date">📅 ${showFormattedDate(createdAt, 'id-ID')}</p>
        <p class="story-location">📍 ${lat ?? '-'}, ${lon ?? '-'}</p>
        <p class="story-description">${description}</p>
        <a class="btn selengkapnya-btn" href="#/stories/${id}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

export function generateStoryDetailImageTemplate(imageUrl = null, alt = '') {
  if (!imageUrl) {
    return `
      <img class="story-detail__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="story-detail__image" src="${imageUrl}" alt="${alt}">
  `;
}

export function generateStoryDetailTemplate({
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, 'id-ID');

  const locationInfo =
    lat !== undefined && lon !== undefined
      ? `<div><i class="fas fa-map-marker-alt"></i> ${lat}, ${lon}</div>`
      : '';

  const mapContainer =
    lat !== undefined && lon !== undefined
      ? `<div id="map" class="story-detail__map"></div>`
      : '';

  return `
    <div class="story-detail__header">
      <h1 class="story-detail__title">${name}</h1>
      <div class="story-detail__info">
        <div><i class="fas fa-calendar-alt"></i> ${createdAtFormatted}</div>
        ${locationInfo}
      </div>
    </div>
    <div class="story-detail__image-container">
      <img class="story-detail__image" src="${photoUrl}" alt="Foto oleh ${name}">
    </div>
    <div class="story-detail__description">
      <h2>Ceritaku Hari ini</h2>
      <p>${description}</p>
    </div>
    ${mapContainer}
  `;
}
