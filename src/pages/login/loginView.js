import LoginPresenter from './loginPresenter.js';
import * as StoryAPI from '../../api/storyApi.js';
import * as AuthUtils from '../../utils/auth.js';

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
    <section class="login-container">
      <div class="login-card">
        <h2>Login</h2>
        <form id="loginForm" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Masukkan email" required />
          </div>

          <div class="form-group">
            <label for="password">Kata Sandi</label>
            <input type="password" id="password" name="password" placeholder="Masukkan password" required />
          </div>

          <div id="submitContainer">
            <button type="submit" class="btn">Login</button>
          </div>
        </form>

        <p id="errorMsg" class="error-message" style="color: red; margin-top: 1rem;"></p>

        <p class="register-link">
          Belum punya akun? <a href="#/register">Daftar di sini</a>
        </p>
      </div>
    </section>
  `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      api: StoryAPI,
      auth: AuthUtils,
    });

    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      this.showLoading();
      this.#presenter.login({ email, password });
    });
  }

  showLoading() {
    document.getElementById('submitContainer').innerHTML = `
      <button class="btn" disabled>
        <i class="fas fa-spinner fa-spin"></i> Processing...
      </button>
    `;
  }

  hideLoading() {
    document.getElementById('submitContainer').innerHTML = `
      <button type="submit" class="btn">Login</button>
    `;
  }

  showError(message) {
    const form = document.getElementById('loginForm');
    if (!form.querySelector('.auth-error')) {
      const errorEl = document.createElement('div');
      errorEl.className = 'auth-error';
      errorEl.textContent = message;
      form.insertBefore(errorEl, form.querySelector('.form-submit'));
    }
  }

  loginFailed(message) {
    this.hideLoading();
    this.showError(message);
  }

  loginSuccessfully(message, data) {
    this.hideLoading();
    alert(message);
    this.redirectToHome();
  }

  redirectToHome() {
    window.location.hash = '/';
  }
}
