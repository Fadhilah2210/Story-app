// src/utils/idb.js
import { saveStory, deleteStory, getAllStories } from '../modeldb/idbHelper.js';

// Menyimpan cerita ke IndexedDB
const saveStoryToOffline = async (story) => {
  try {
    await saveStory(story);  // Gunakan fungsi saveStory dari idbHelper.js
    alert('Cerita disimpan offline!');
  } catch (error) {
    alert('Gagal menyimpan cerita offline: ' + error.message);
  }
};

// Menghapus cerita dari IndexedDB
const deleteStoryFromOffline = async (id) => {
  try {
    await deleteStory(id);  // Fungsi deleteStory dari idbHelper.js
    alert('Cerita dihapus dari offline!');
  } catch (error) {
    alert('Gagal menghapus cerita: ' + error.message);
  }
};

// Menampilkan daftar cerita offline
const showOfflineStories = async () => {
  const stories = await getAllStories();  // Mendapatkan semua cerita dari IndexedDB
  const container = document.getElementById('offline-stories');
  container.innerHTML = '';

  stories.forEach((story) => {
    const storyEl = document.createElement('div');
    storyEl.innerHTML = `<h3>${story.name}</h3><p>${story.description}</p><button class="delete-btn" data-id="${story.id}">Hapus</button>`;
    container.appendChild(storyEl);
  });
  
  // Menambahkan event listener untuk tombol hapus
  container.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const id = e.target.getAttribute('data-id');
      await deleteStoryFromOffline(id);
      showOfflineStories();  // Reload daftar cerita setelah penghapusan
    }
  });
};

export { saveStoryToOffline, showOfflineStories };
