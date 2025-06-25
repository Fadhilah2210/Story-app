// src/pages/saved/savedPresenter.js
import { getAllStories, deleteStory } from '../../modeldb/idbHelper.js';
import createSavedStoryTemplate from './savedItemTemplate.js'; 

const savedPresenter = {
  async render() {
    const stories = await getAllStories();
    const container = document.getElementById('main-content');
    container.innerHTML = '<h2>Story Tersimpan Offline</h2>';

    if (stories.length === 0) {
      container.innerHTML += '<p>Belum ada cerita yang disimpan offline.</p>';
    } else {
      stories.forEach((story) => {
        const storyElement = document.createElement('div');
        storyElement.innerHTML = createSavedStoryTemplate(story); 
        container.appendChild(storyElement);
      });
    }

    container.addEventListener('click', async (e) => {
      if (e.target.classList.contains('delete-btn')) {
        const id = e.target.getAttribute('data-id');
        await deleteStory(id);
        this.render(); // Refresh daftar cerita
      }
    });
  },
};

export default savedPresenter;
