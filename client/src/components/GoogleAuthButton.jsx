import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

function GoogleAuthButton({
  destination = "/dashboard",
  navigate,
  location,
  onErrorMessage,
  width = "354",
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSuccess(credentialResponse) {
    const credential = credentialResponse?.credential;

    if (!credential) {
      onErrorMessage(
        "Google did not return a valid credential."
      );
      return;
    }

    setIsLoading(true);
    onErrorMessage("");

    try {
      const response = await fetch("/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          credential,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Google authentication failed."
        );
      }

      navigate(destination, {
        replace: true,
        state: {
          listingId: location?.state?.listingId,
          action: location?.state?.action,
        },
      });
    } catch (error) {
      onErrorMessage(
        error.message || "Unable to sign in with Google."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoogleError() {
    onErrorMessage(
      "Google sign-in was cancelled or could not be completed."
    );
  }

  return (
    <div
      aria-busy={isLoading}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        text="continue_with"
        shape="rectangular"
        size="large"
        width={width}
        useOneTap={false}
      />

      {isLoading && (
        <p role="status">
          Signing in...
        </p>
      )}
    </div>
  );
}

export default GoogleAuthButton;