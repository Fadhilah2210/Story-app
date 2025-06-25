import { getAccessToken } from "./auth.js"; // atau path sesuai filemu

const VAPID_PUBLIC_KEY =
  "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeUserToPush(registration) {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    return subscription;
  } catch (error) {
    console.error("❌ Gagal subscribe:", error);
    return null;
  }
}

async function sendSubscriptionToServer(subscription) {
  const token = getAccessToken();

  try {
    const response = await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.getKey("p256dh")
            ? btoa(
                String.fromCharCode(
                  ...new Uint8Array(subscription.getKey("p256dh"))
                )
              )
            : null,
          auth: subscription.getKey("auth")
            ? btoa(
                String.fromCharCode(
                  ...new Uint8Array(subscription.getKey("auth"))
                )
              )
            : null,
        },
      }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);
    console.log("✅ Subscription sukses dikirim:", result);
  } catch (error) {
    console.error("❌ Gagal kirim subscription ke server:", error);
  }
}

async function registerPushNotification() {
  if (!("serviceWorker" in navigator)) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("❌ Izin notifikasi ditolak");
      return;
    }

    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    });
    console.log("✅ Service worker terdaftar:", registration);

    const subscription = await subscribeUserToPush(registration);
    if (subscription) {
      await sendSubscriptionToServer(subscription);
    }
  } catch (error) {
    console.error("❌ Gagal register push notification:", error);
  }
}

async function unsubscribePush() {
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (subscription) {
    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();

    const token = getAccessToken();
    await fetch("https://story-api.dicoding.dev/v1/notifications/subscribe", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endpoint }),
    });
    console.log("🗑️ Unsubscribed dari push notification.");
  }
}

export  {
  registerPushNotification,
  sendSubscriptionToServer,
  unsubscribePush,
};
