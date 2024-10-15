import axios from "axios";
import {
  pushNotificationSubscribeRoute,
  sendPushNotificationRouter,
} from "../utils/ApiRoutes";

export const subscribeUser = async (userId) => {
  console.log("UserId: ", userId);
  const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
  console.log("PUBLIC_VAPID_KEY: ", publicVapidKey);
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BJGP9qG6HiHw-PEUyK18zevMrmGdy6mz4WzyWKsDQRxqw8aCo9h4CpgOz0_lzzjVORCpeFvy3zGQ0EDY-YJXI8I"
      ),
    });

    // const body = {subscription:subscription, userId: userId}

    await axios.post(
      `${pushNotificationSubscribeRoute}`,
      {
        subscription,
        userId: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log("Error: ", err);
  }
};

export const notifyUser = async (userName, userId, title, body) => {
  console.log("userName: ", userName);
  try {
    const response = await axios.post(
      `${sendPushNotificationRouter}`,
      {
        userName,
        userId,
        title,
        body,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("response: ", response);
  } catch (err) {
    console.log("Error sending notification: ", err);
  }
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String?.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
