import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPassword.css";

export default function ForgotPassword() {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setMessage("");
    setError("");
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Email sent. Check your inbox.");
        setEmail("");
      } else if (res.status === 403) {
        setError("Your account is still pending administrator approval.");
      } else {
        setError(data.message || "Error sending email.");
      }
    } catch {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-screen">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="forgot-video"
      >
        <source src="assets/kia-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="forgot-container">
        <img src="assets/kia-logo-white.png" alt="KIA Logo" className="forgot-logo" />

        <div className="forgot-wrapper">
          <h2 className="forgot-title">Forgot Password</h2>
          <form className="forgot-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              className="forgot-input"
              value={email}
              onChange={handleChangeEmail}
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="forgot-button"
              disabled={loading || !isValidEmail(email)}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <p
            className={`forgot-message ${message ? "success" : error ? "error" : ""}`}
          >
            {message || error}
          </p>

          <p className="forgot-back" onClick={() => navigate("/login")}>
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
}