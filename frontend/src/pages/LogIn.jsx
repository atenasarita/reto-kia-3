import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LogIn.css";

export default function LogIn() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 13.1;
    const onTimeUpdate = () => {
      if (video.currentTime >= 20.5) video.currentTime = 13.1;
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => video.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, password } = formData;

    if (!/^\d{8}$/.test(username)) {
      setError("Invalid username format");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/session-started");
      } else {
        if (data.message?.toLowerCase().includes("invalid credentials")) {
          setError("User not found or incorrect password");
        } else {
          setError(data.message || "Login failed");
        }
      }
    } catch {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-screen">
      <video ref={videoRef} autoPlay muted loop playsInline className="login-video">
        <source src="assets/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <div className="login-container">
        <img src="assets/kia-logo-white.png" alt="KIA logo" className="login-logo" />

        <div className="login-wrapper">
          <div className="login-left-section">
            <h1>Welcome Back!</h1>
            <p>
              Don't have an account yet? <Link to="/signup">Sign Up</Link>
            </p>
          </div>

          <div className="login-right-section">
            <form onSubmit={handleSubmit}>
              <label>Username</label>
              <input
                type="text"
                name="username"
                className="login-field"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="login-field"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <p className="login-forgot-password" onClick={() => navigate("/forgot-password")}>
                Forgot Password?
              </p>
              {error && <p className="login-error-message">{error}</p>}
              <button type="submit" className="login-button">Log In</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}