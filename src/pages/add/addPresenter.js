// addPresenter.js
export default class addPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async postNewStory(data) {
    try {
      const result = await this.#model.storeNewStory(data);

      if (result.error === false) {
        this.#view.storeSuccessfully('Story berhasil dibuat!');

        // Push Notification with permission check
        if ('Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window) {
          const permission = await Notification.requestPermission();

          if (permission === 'granted') {
            const registration = await navigator.serviceWorker.ready;
            registration.showNotification('Story berhasil dibuat', {
              body: `Anda telah membuat story baru dengan deskripsi: ${data.description}`,
              icon: '/icons/icon-192x192.png', // Pastikan icon ini ada
              vibrate: [100, 50, 100],
            });
          } else {
            console.warn('Notifikasi tidak diizinkan oleh pengguna.');
          }
        }
      } else {
        this.#view.storeFailed('Gagal membuat story, coba lagi.');
      }
    } catch (error) {
      this.#view.storeFailed('Terjadi kesalahan, coba lagi.');
      console.error('Error posting new story:', error);
    }
  }
}
