import "./styles/style.css";
import "tiny-slider/dist/tiny-slider.css";
import "leaflet/dist/leaflet.css";

import App from "./pages/app.js";
import Camera from "./utils/camera.js";
import {
  registerPushNotification,
  sendSubscriptionToServer,
  unsubscribePush,
} from "./utils/push-notification.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      // const registration = await navigator.serviceWorker.register("/sw.js", {
      //   scope: "/",
      // });
      // console.log("SW registered with scope:", registration.scope);
    } catch (error) {
      console.error("SW registration failed:", error);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.getElementById("main-content"),
    drawerButton: document.getElementById("drawer-button"),
    drawerNavigation: document.getElementById("navigation-drawer"),
    skipLinkButton: document.getElementById("skip-link"),
  });

  registerPushNotification();

  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    // await app.renderPage();
    // Camera.stopAllStreams();
  });
});

const subsButton = document.getElementById("subs-button");

async function isUserSubscribed() {
  if (!("serviceWorker" in navigator)) return false;
  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
}

async function updateSubscribeButton() {
  const isSubscribed = await isUserSubscribed();
  subsButton.textContent = isSubscribed ? "🔕 Unsubscribe" : "🔔 Subscribe";
}

async function handleSubscriptionToggle() {
  const isSubscribed = await isUserSubscribed();

  if (isSubscribed) {
    await unsubscribePush();
  } else {
    await registerPushNotification();
  }

  updateSubscribeButton();
}

// Saat tombol diklik
subsButton.addEventListener("click", (e) => {
  e.preventDefault();
  handleSubscriptionToggle();
});

// Update teks tombol saat pertama kali dimuat
document.addEventListener("DOMContentLoaded", updateSubscribeButton);
