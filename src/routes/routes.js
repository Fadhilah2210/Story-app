import RegisterPage from '../pages/register/registerView.js';
import LoginPage from '../pages/login/loginView.js';
import HomePage from '../pages/home/homeView.js';
import StoryDetailPage from '../pages/detail/detailView.js';
import NewPage from '../pages/add/addView.js';
import SavedStoriesPage from '../pages/saved/savedView.js';

import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth.js';

export const routes = {  // ✅ Kembali ke export const
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/new': () => checkAuthenticatedRoute(new NewPage()),
  '/stories/:id': () => checkAuthenticatedRoute(new StoryDetailPage()),
  '/saved': () => checkAuthenticatedRoute(new SavedStoriesPage()),
};