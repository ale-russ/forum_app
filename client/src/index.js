import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserAuthProvider } from "./utils/UserAuthenticationProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
const googleClientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID_NEW;

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <UserAuthProvider>
        <App />
      </UserAuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
