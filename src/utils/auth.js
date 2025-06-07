import { getActiveRoute } from '../routes/url-parser.js';
import { ACCESS_TOKEN_KEY } from '../config.js';

// Mendapatkan token akses dari localStorage
export function getAccessToken() {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    // Jika token tidak ada atau tidak valid, kembalikan null
    if (accessToken === 'null' || accessToken === 'undefined') {
      return null;
    }

    return accessToken;
  } catch (error) {
    console.error('getAccessToken: error:', error);
    return null;
  }
}

// Menyimpan token akses ke localStorage
export function putAccessToken(token) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('putAccessToken: error:', error);
    return false;
  }
}

// Menghapus token akses dari localStorage
export function removeAccessToken() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    console.log(`Token dengan key '${ACCESS_TOKEN_KEY}' sudah dihapus`);
    return true;
  } catch (error) {
    console.error('Error removeAccessToken:', error);
    return false;
  }
}


// Daftar rute yang hanya bisa diakses oleh pengguna yang belum login
const unauthenticatedRoutesOnly = ['/login', '/register'];

// Memeriksa rute untuk memastikan pengguna yang belum login hanya dapat mengakses halaman tertentu
export function checkUnauthenticatedRouteOnly(page) {
  const url = getActiveRoute();
  const isLogin = !!getAccessToken();

  if (unauthenticatedRoutesOnly.includes(url) && isLogin) {
    location.hash = '/'; // Mengarahkan ke halaman utama jika sudah login
    return null;
  }

  return page;
}

// Memeriksa rute untuk memastikan pengguna yang sudah login hanya bisa mengakses halaman yang sesuai
export function checkAuthenticatedRoute(page) {
  const isLogin = !!getAccessToken();

  if (!isLogin) {
    location.hash = '/login'; // Mengarahkan ke halaman login jika belum login
    return null;
  }

  return page;
}

// Fungsi untuk logout dan menghapus token akses
export function getLogout() {
  removeAccessToken(); // Menghapus token dari localStorage
  console.log('Token removed. User logged out.');

  // Arahkan ke halaman login
  location.hash = '/login'; // Mengubah hash URL agar router memprosesnya
}