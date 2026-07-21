import React from "react";

function SignInPopup({
  showSignInPopup,
  setShowSignInPopup,
}) {
  if (!showSignInPopup) {
    return null;
  }

  return (
    <div
      className="signin-popup-backdrop"
      onClick={() => setShowSignInPopup(false)}
    >
      <div
        className="signin-popup"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="popup-close"
          type="button"
          onClick={() => setShowSignInPopup(false)}
        >
          ×
        </button>

        <div className="popup-lock">🔒</div>

        <h2>Sign in to continue</h2>

        <p>
          You must sign in or create a Knight Marketplace account
          to contact this seller or save this item.
        </p>

        <button
          className="popup-signin-button"
          type="button"
        >
          Sign In
        </button>

        <button
          className="popup-register-button"
          type="button"
        >
          Register
        </button>

        <button
          className="popup-cancel-button"
          type="button"
          onClick={() => setShowSignInPopup(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default SignInPopup;
