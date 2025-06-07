export default class Camera {
  static #currentStream = null;

  static async startCameraStream(videoElement) {
    if (Camera.#currentStream) {
      console.log('Kamera sudah aktif');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      videoElement.srcObject = stream;
      videoElement.play();
      Camera.#currentStream = stream;
    } catch (err) {
      console.error('Gagal mengakses kamera:', err);
      alert('Gagal mengakses kamera. Pastikan Anda memberikan izin.');
    }
  }

  static stopCameraStream(videoElement) {
    if (Camera.#currentStream) {
      Camera.#currentStream.getTracks().forEach((track) => track.stop());
      videoElement.srcObject = null;
      Camera.#currentStream = null;
    }
  }

  static stopAllStreams() {
    if (Camera.#currentStream) {
      Camera.#currentStream.getTracks().forEach((track) => track.stop());
      Camera.#currentStream = null;
    }

    document.querySelectorAll('video').forEach((video) => {
      video.srcObject = null;
    });
  }

  static async takeSnapshot(videoElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob));
    });
  }
}
