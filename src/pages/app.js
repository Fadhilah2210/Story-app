import { getActiveRoute } from '../routes/url-parser.js';
import {
  generateAuthenticatedNavigationListTemplate,
  generateMainNavigationListTemplate,
  generateUnauthenticatedNavigationListTemplate,
} from '../template.js';
import { setupSkipToContent, transitionHelper } from '../utils/index.js';
import { getAccessToken, getLogout } from '../utils/auth.js';
import { routes } from '../routes/routes.js';

export default class App {
  #content;
  #drawerButton;
  #drawerNavigation;
  #skipLinkButton;

  constructor({ content, drawerNavigation, drawerButton, skipLinkButton }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#drawerNavigation = drawerNavigation;
    this.#skipLinkButton = skipLinkButton;

    this.#init();
  }

  #init() {
    if (this.#skipLinkButton && this.#content) {
      setupSkipToContent(this.#skipLinkButton, this.#content);
    }
    this.#setupDrawer();
    this.#setupLogoutButton();
  }

  #setupDrawer() {
    if (!this.#drawerButton || !this.#drawerNavigation) return;

    this.#drawerButton.addEventListener('click', () => {
      this.#drawerNavigation.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      const isTargetInsideDrawer = this.#drawerNavigation.contains(event.target);
      const isTargetInsideButton = this.#drawerButton.contains(event.target);

      if (!(isTargetInsideDrawer || isTargetInsideButton)) {
        this.#drawerNavigation.classList.remove('open');
      }

      this.#drawerNavigation.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#drawerNavigation.classList.remove('open');
        }
      });
    });
  }

  #setupLogoutButton() {
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', (event) => {
        event.preventDefault();

        if (confirm('Apakah Anda yakin ingin keluar?')) {
          getLogout();
          location.hash = '/login';
        }
      });
    }
  }

  #setupNavigationList() {
    if (!this.#drawerNavigation) return;

    const isLogin = !!getAccessToken();
    const navListMain = this.#drawerNavigation.querySelector('#navlist-main');
    const navList = this.#drawerNavigation.querySelector('#navlist');

    if (!navListMain || !navList) return;

    if (!isLogin) {
      navListMain.innerHTML = '';
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    navListMain.innerHTML = generateMainNavigationListTemplate();
    navList.innerHTML = generateAuthenticatedNavigationListTemplate();
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url] || routes['/'];

    const page = route();

    if (!page || !page.render) {
      if (!getAccessToken()) {
        alert('Anda harus login terlebih dahulu.');
        location.hash = '/login';
        return;
      }

      this.#content.innerHTML = `<p>Halaman tidak ditemukan.</p>`;
      return;
    }
    
    const transition = transitionHelper({
      updateDOM: async () => {
        // Proses render halaman
        this.#content.innerHTML = await page.render();
        page.afterRender();
      },
    });

    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: 'instant' });
      this.#setupNavigationList();
    });
  }
}
