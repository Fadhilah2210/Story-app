const VAPID_PUBLIC_KEY = 'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

/**
 * Mengubah VAPID key dari base64 menjadi UInt8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Melakukan subscribe user ke push notification
 */
async function subscribeUserToPush(registration, vapidPublicKey) {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
    return subscription;
  } catch (error) {
    console.error('Gagal melakukan subscribe:', error);
    return null;
  }
}

/**
 * Simulasi kirim subscription ke server
 */
async function sendSubscriptionToServer(subscription) {
  console.log('Subscription terkirim ke server:', subscription);
  // Simulasi:
  // await fetch('/api/subscribe', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(subscription),
  // });
}

/**
 * Fungsi utama untuk mendaftarkan push notification
 */
async function registerPushNotification() {
  if (!('serviceWorker' in navigator)) return;

  try {
    // ✅ Minta izin notifikasi
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Izin notifikasi tidak diberikan.');
      return;
    }

    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('✅ Service worker terdaftar:', registration);

    const subscription = await subscribeUserToPush(registration, VAPID_PUBLIC_KEY);
    if (subscription) {
      await sendSubscriptionToServer(subscription);
    }
  } catch (error) {
    console.error('❌ Gagal register service worker:', error);
  }
}

export default registerPushNotification;
