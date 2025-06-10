import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";

export default function ResetPassword() {
  const videoRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing token.");
  }, [token]);

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

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
    setMessage("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password reset successfully. Redirecting...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        // Validación de token expirado o inválido
        if (res.status === 400 && data.message?.toLowerCase().includes("expired")) {
          setError("Your reset link is invalid or has expired. Please request a new one.");
        } else {
          setError(data.message || "Error resetting password.");
        }
      }
    } catch {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-screen">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="reset-password-video"
      >
        <source src="assets/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <div className="reset-password-wrapper">
        <img src="assets/kia-logo-white.png" alt="KIA logo" className="reset-password-logo" />

        <div className="reset-password-container">
          <h2 className="reset-password-title">Reset Password</h2>

          {(error || message) && (
            <p className={`reset-password-message ${message ? "success" : "error"}`}>
              {message || error}
            </p>
          )}

          {!message && token && (
            <form className="reset-password-form" onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="New password"
                className="reset-password-input"
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
                required
                minLength={6}
                aria-label="New password"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                className="reset-password-input"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                disabled={loading}
                required
                minLength={6}
                aria-label="Confirm new password"
              />
              <button
                type="submit"
                className="reset-password-button"
                disabled={loading}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}