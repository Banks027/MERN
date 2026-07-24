import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const googleClientId =
  process.env.REACT_APP_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  console.error(
    "REACT_APP_GOOGLE_CLIENT_ID is missing."
  );
}

const root = ReactDOM.createRoot(
  document.getElementById("root")
);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();