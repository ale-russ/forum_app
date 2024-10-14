import React, { useEffect } from "react";

const NotificationComponent = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted");
        } else {
          console.log("Notification permission denied");
        }
      });
    } else {
      console.warn("Push messaging is not supported by this browser");
    }
  }, []);
  return <div>Enable Notifications</div>;
};

export default NotificationComponent;
