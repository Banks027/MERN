import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
mern@marketplace-s-1vcpu-2gb-nyc1:~/client$ cat /home/mern/client/src/pages/Login.jsx
import React, { useState } from "react";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Login information:", formData);
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>Welcome Back</h1>
        <p>Log in to continue using KnightMarket.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">UCF Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="name@ucf.edu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Log In</button>
        </form>

        <button type="button" className="google-button">
          Continue with Google
        </button>

        <p>
          Do not have an account? <a href="/register">Create one</a>
        </p>
      </section>
    </main>
  );
}

export default Login;
