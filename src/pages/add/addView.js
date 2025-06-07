import Camera from '../../utils/camera.js';
import addPresenter from './addPresenter.js';
import * as StoryAPI from '../../api/storyApi.js';
import L from 'leaflet';

let snapshotBlob = null;

export default class AddView {
  async render() {
    return `
      <section class="add-story">
        <h2>Tambah Cerita</h2>
        <form id="addForm">
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" required></textarea>
          </div>

          <div class="form-group">
            <label>Kamera</label>
            <video id="cameraPreview" autoplay playsinline width="300"></video>
            <img id="snapshotPreview" style="display:none; width: 300px;" />
            <div>
              <button type="button" id="takePhotoBtn">Ambil Gambar</button>
              <button type="button" id="retakePhotoBtn" style="display:none;">Ulangi</button>
            </div>
          </div>

          <div class="form-group">
            <label for="map">Pilih Lokasi</label>
            <div id="map" style="height: 300px;"></div>
            <input type="hidden" id="lat" name="lat" />
            <input type="hidden" id="lon" name="lon" />
          </div>

          <button type="submit">Kirim</button>
        </form>
        <p id="formMsg" style="margin-top:1rem;color:red;"></p>
      </section>
    `;
  }

  async afterRender() {
    const form = document.getElementById('addForm');
    const msg = document.getElementById('formMsg');
    const cameraPreview = document.getElementById('cameraPreview');
    const snapshotPreview = document.getElementById('snapshotPreview');
    const takeBtn = document.getElementById('takePhotoBtn');
    const retakeBtn = document.getElementById('retakePhotoBtn');
    const latInput = document.getElementById('lat');
    const lonInput = document.getElementById('lon');

    // Start camera
    await Camera.startCameraStream(cameraPreview);

    takeBtn.addEventListener('click', async () => {
      snapshotBlob = await Camera.takeSnapshot(cameraPreview);
      snapshotPreview.src = URL.createObjectURL(snapshotBlob);
      snapshotPreview.style.display = 'block';
      cameraPreview.style.display = 'none';
      takeBtn.style.display = 'none';
      retakeBtn.style.display = 'inline-block';
      Camera.stopCameraStream(cameraPreview);
    });

    retakeBtn.addEventListener('click', async () => {
      snapshotBlob = null;
      snapshotPreview.style.display = 'none';
      cameraPreview.style.display = 'block';
      takeBtn.style.display = 'inline-block';
      retakeBtn.style.display = 'none';
      await Camera.startCameraStream(cameraPreview);
    });

    const mapContainer = document.getElementById('map');
    if (mapContainer && mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
    }

    // Map
    const map = L.map('map').setView([-6.2, 106.8], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    let marker;
    map.on('click', function (e) {
      const { lat, lng } = e.latlng;
      latInput.value = lat;
      lonInput.value = lng;

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        marker = L.marker([lat, lng]).addTo(map);
      }
    });

    // Init presenter
    const presenter = new addPresenter({ view: this, model: StoryAPI });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!snapshotBlob) {
        msg.style.color = 'red';
        msg.innerText = 'Harap ambil gambar terlebih dahulu.';
        return;
      }

      const description = document.getElementById('description').value;
      const lat = latInput.value;
      const lon = lonInput.value;

      const formData = new FormData();
      formData.append('description', description);
      formData.append('lat', lat);
      formData.append('lon', lon);
      formData.append('photo', snapshotBlob, 'snapshot.jpg');

      await presenter.postNewStory({
        description,
        evidenceImages: [snapshotBlob], 
        latitude: lat,
        longitude: lon,
      });
    });
  }

  storeSuccessfully(message) {
    const msg = document.getElementById('formMsg');
    msg.style.color = 'green';
    msg.innerText = message;

    setTimeout(() => {
      window.location.hash = '/';
    }, 1500);
  }

  storeFailed(message) {
    const msg = document.getElementById('formMsg');
    msg.style.color = 'red';
    msg.innerText = message;
  }
}
