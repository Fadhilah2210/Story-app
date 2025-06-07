// src/pages/saved/savedView.js
import savedPresenter from './savedPresenter.js';  // Import presenter untuk halaman Saved Stories

export default class SavedStoriesPage {
  async render() {
    return `
      <section class="container">
        <h1>Cerita yang Tersimpan Offline</h1>
        <div id="main-content"></div>  <!-- Tempat untuk menampilkan cerita -->
      </section>
    `;
  }

  async afterRender() {
    savedPresenter.render();  // Memanggil render dari savedPresenter.js untuk menampilkan cerita yang disimpan
  }
}
