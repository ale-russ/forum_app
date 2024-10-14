import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserAuthProvider } from "./utils/UserAuthenticationProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
const googleClientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID_NEW;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log(
          "Service Worker registered with scope: ",
          registration.scope
        );
      })
      .catch((err) => {
        console.log("Service Worker registration failed: ", err);
      });
  });
}

root.render(
  <React.StrictMode>
    {/* <GoogleOAuthProvider clientId={googleClientId}> */}
    <UserAuthProvider>
      <App />
    </UserAuthProvider>
    {/* </GoogleOAuthProvider> */}
  </React.StrictMode>
);

reportWebVitals();
