const StoryModel = {
  async getStories(token) {
    const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Gagal mengambil data story");
    }

    const result = await response.json();
    return result.listStory;
  }
};

export default StoryModel;
