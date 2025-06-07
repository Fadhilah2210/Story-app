// src/pages/detail/detailPresenter.js
export default class detailPresenter {
  #view;
  #model;
  #storyId;

  constructor({ view, model, storyId }) {
    this.#view = view;
    this.#model = model;
    this.#storyId = storyId;
  }

  async showStoryDetail() {
    this.#view.showLoading();
    try {
      const response = await this.#model.getStoryById(this.#storyId);
      if (response.error || !response.story) {
        this.#view.showError(response.message || 'Failed to load story');
        return;
      }

      this.#view.showStoryDetail(response.story);
    } catch (error) {
      this.#view.showError(error.message || 'An error occurred');
    } finally {
      this.#view.hideLoading();
    }
  }
}
