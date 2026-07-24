import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import PostItemPreferences from "./pages/PostItemPreferences";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Listings from "./pages/Listings";
import About from "./pages/About";
import ErrorPage from "./pages/ErrorPage";
import Notifications from "./pages/Notifications";
import SavedItems from "./pages/SavedItems";
import PostItem from "./pages/PostItem";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import MyListings from "./pages/MyListings";

function App() {
  return (
    <BrowserRouter>

      <Routes>


        <Route
        path="/post-item/preferences"
        element={<PostItemPreferences />}
            />
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
        path="*"
        element={<ErrorPage />} 
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



      </Routes>
    </BrowserRouter>
  );
}

export default App;
