import RegisterPresenter from './registerPresenter.js';
import * as StoryAPI from '../../api/storyApi.js';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
    <section class="register-container">
      <div class="register-card">
        <h2>Daftar Akun</h2>
        <form id="registerForm" class="register-form">
          <div class="form-group">
            <label for="name">Nama</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required />
          </div>
          <div class="form-group">
            <label for="password">Kata Sandi</label>
            <input type="password" id="password" name="password" required />
          </div>
          
          <div id="submitContainer">
            <button type="submit" class="btn btn-primary">Daftar</button>
          </div>
        </form>

        <p id="registerMsg" class="register-msg"></p>
        <p class="login-link">Sudah punya akun? <a href="#/login">Masuk di sini</a></p>
      </div>
    </section>
  `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      api: StoryAPI,
    });

    document.getElementById('registerForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      this.#presenter.register({ name, email, password });
    });
  }

  showLoading() {
    document.getElementById('submitContainer').innerHTML = `
      <button class="btn btn-primary" disabled>
        <i class="fas fa-spinner fa-spin"></i> Processing...
      </button>
    `;
  }

  hideLoading() {
    document.getElementById('submitContainer').innerHTML = `
      <button type="submit" class="btn btn-primary">Register</button>
    `;
  }

  showError(message) {
    const form = document.getElementById('registerForm');
    if (!form.querySelector('.auth-error')) {
      const errorEl = document.createElement('div');
      errorEl.className = 'auth-error';
      errorEl.textContent = message;
      form.insertBefore(errorEl, form.querySelector('.form-submit'));
    }
  }

  redirectToLogin() {
    window.location.hash = '/login';
  }
}
