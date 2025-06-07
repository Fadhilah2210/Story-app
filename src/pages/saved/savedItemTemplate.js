const createSavedStoryTemplate = (story) => `
  <div class="story-card" style="
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    padding: 24px;
    margin-bottom: 24px;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    font-family: sans-serif;
  ">
    <h3 style="margin-top: 0; color: #333;">${story.name}</h3>

    <p style="margin: 12px 0; color: #555;">
      ${story.description || '<em>(Tidak ada deskripsi)</em>'}
    </p>

    ${story.photoUrl ? `
      <img 
        src="${story.photoUrl}" 
        alt="Foto Cerita" 
        style="width: 100%; max-height: 300px; object-fit: cover; border-radius: 12px; margin: 12px 0;" 
      />` : ''}

    ${story.lat && story.lon ? `
      <iframe
        width="100%"
        height="200"
        frameborder="0"
        style="border:0; border-radius: 12px; margin-bottom: 12px;"
        src="https://www.google.com/maps?q=${story.lat},${story.lon}&hl=es;z=14&output=embed">
      </iframe>` : ''}

    <button 
      class="delete-btn" 
      data-id="${story.id}"
      style="
        background-color: #e91e63;
        color: white;
        border: none;
        padding: 10px 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
      "
      onmouseover="this.style.backgroundColor='#d81b60'"
      onmouseout="this.style.backgroundColor='#e91e63'"
    >
      Hapus
    </button>
  </div>
`;

export default createSavedStoryTemplate;
