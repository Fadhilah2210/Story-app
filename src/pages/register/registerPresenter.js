export default class RegisterPresenter {
  #view;
  #api;

  constructor({ view, api }) {
    this.#view = view;
    this.#api = api;
  }

  async register({ name, email, password }) {
    this.#view.showLoading();
    try {
      const result = await this.#api.getRegistered({ name, email, password });

      if (!result.ok || result.error) {
        this.#view.showError(result.message || 'Registrasi gagal');
        return;
      }

      alert(result.message);
      this.#view.redirectToLogin();
    } catch (err) {
      console.error('RegisterPresenter.register error:', err);
      this.#view.showError(err.message || 'Terjadi kesalahan');
    } finally {
      this.#view.hideLoading();
    }
  }
}
