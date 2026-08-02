import React, { lazy, Suspense } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import ErrorPage from "./pages/ErrorPage";
import Notifications from "./pages/Notifications";
import SavedItems from "./pages/SavedItems";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

const Listings = lazy(() =>
  import("./pages/Listings")
);

const PostItem = lazy(() =>
  import("./pages/PostItem")
);

const MyListings = lazy(() =>
  import("./pages/MyListings")
);

const PostItemPreferences = lazy(() =>
  import("./pages/PostItemPreferences")
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/verify-email"
            element={<VerifyEmail />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/listings"
            element={<Listings />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/post-item"
            element={<PostItem />}
          />

          <Route
            path="/post-item/preferences"
            element={<PostItemPreferences />}
          />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          <Route
            path="/saveditems"
            element={<SavedItems />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/my-listings"
            element={<MyListings />}
          />

          <Route
            path="*"
            element={<ErrorPage />}
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;