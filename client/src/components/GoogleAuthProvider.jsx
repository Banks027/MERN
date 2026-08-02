import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

function GoogleAuthProvider({ children }) {
  const googleClientId =
    process.env.REACT_APP_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    console.error(
      "REACT_APP_GOOGLE_CLIENT_ID is missing."
    );

    return children;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      {children}
    </GoogleOAuthProvider>
  );
}

export default GoogleAuthProvider;