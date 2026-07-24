import React from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

function SignInPopup({
  showSignInPopup,
  setShowSignInPopup,
  selectedListing,
  pendingAction,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  if (!showSignInPopup) {
    return null;
  }

  function closePopup() {
    setShowSignInPopup(false);
  }

  function handleSignIn() {
    closePopup();

    navigate("/login", {
      state: {
        from: location.pathname,
        listingId: selectedListing?.id,
        action: pendingAction,
      },
    });
  }

  function handleRegister() {
    closePopup();

    navigate("/register", {
      state: {
        from: location.pathname,
        listingId: selectedListing?.id,
        action: pendingAction,
      },
    });
  }

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      closePopup();
    }
  }

  return (
    <div
      className="signin-popup-backdrop"
      onClick={handleOverlayClick}
    >
      <section
        className="signin-popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-popup-title"
      >
        <button
          type="button"
          className="modal-close"
          onClick={closePopup}
          aria-label="Close popup"
        >
          ×
        </button>

        <div className="popup-lock">
          ♞
        </div>

        <h2 id="signin-popup-title">
          Sign in required
        </h2>

        <p>
          Please sign in or create an account to
          continue.
        </p>

        <button
          type="button"
          className="popup-signin-button"
          onClick={handleSignIn}
        >
          Sign In
        </button>

        <button
          type="button"
          className="popup-register-button"
          onClick={handleRegister}
        >
          Register
        </button>

        <button
          type="button"
          className="popup-cancel-button"
          onClick={closePopup}
        >
          Cancel
        </button>
      </section>
    </div>
  );
}

export default SignInPopup;
