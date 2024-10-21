import axios from "axios";
import {
  pushNotificationSubscribeRoute,
  sendPostCreationPushNotificationRoute,
  sendPrivateMessagePushNotificationRoute,
} from "../utils/ApiRoutes";

export const subscribeUser = async (userId) => {
  try {
    if (!userId) {
      throw "User ID is required";
      return;
    }
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BJGP9qG6HiHw-PEUyK18zevMrmGdy6mz4WzyWKsDQRxqw8aCo9h4CpgOz0_lzzjVORCpeFvy3zGQ0EDY-YJXI8I"
      ),
    });
    if (subscription) {
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
    }
  } catch (err) {
    // console.log("Error: ", err);
    // throw "Push Notification Registration Error";
    return;
  }
};

export const privateMessageNotification = async (
  userName,
  userId,
  title,
  body
) => {
  try {
    const response = await axios.post(
      `${sendPrivateMessagePushNotificationRoute}`,
      {
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

export const createPostNotification = async (userId, title, body) => {
  try {
    const response = await axios.post(
      `${sendPostCreationPushNotificationRoute}`,
      {
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
    // console.log("Push Notification Response: ", response);
    return response;
  } catch (err) {
    // console.log("Error sending notification: ", err);
    return Promise.reject(err); // Ensure that the error is propagated
  }
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String?.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
