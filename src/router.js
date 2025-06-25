import { routes } from './routes/routes.js';  

const router = async () => {
  const url = window.location.hash.slice(1).toLowerCase() || '/';
  console.log('Current hash URL:', window.location.hash);

  const routeFunc = routes[url];

  if (!routeFunc) {
    document.getElementById('main-content').innerHTML = '<h2>Page not found</h2>';
    return;
  }

  try {
    const page = routeFunc();

    if (!page) {
      console.warn('Tidak ada halaman yang dirender, kemungkinan user belum login.');
      return;
    }

    const content = document.getElementById('main-content');
    content.innerHTML = await page.render();
    
    if (page.afterRender && typeof page.afterRender === 'function') {
      await page.afterRender();
    }
  } catch (error) {
    console.error('Error rendering page:', error);
    document.getElementById('main-content').innerHTML = '<h2>Error loading page</h2>';
  }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);