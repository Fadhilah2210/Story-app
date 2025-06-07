export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initialGalleryAndMap() {
    try {
      this.#view.showMapLoading();
      this.#view.showLoading();

      const result = await this.#model.getAllStories({ location: 1 });
      console.log('Result:', result); // Debug jika API error

      if (result.error) {
        throw new Error(result.message || 'Gagal mengambil data');
      }

      const stories = result.listStory || [];
      this.#view.populateStoriesList(null, stories);

      this.#view.initialMap(stories);
    } catch (error) {
      this.#view.populateStoriesListError(error.message);
      this.#view.hideMapLoading();
      this.#view.hideLoading();
    }
  }
}
