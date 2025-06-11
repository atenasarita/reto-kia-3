import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/SignUp.css";

export default function SignUp() {
  const videoRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    firstSurname: "",
    secondSurname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 2;
    const onTimeUpdate = () => {
      if (video.currentTime >= 9) video.currentTime = 2;
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
    setSuccess("");

    const {
      name,
      firstSurname,
      secondSurname,
      username,
      email,
      password,
      confirmPassword,
    } = formData;

    if (!name || !firstSurname || !username || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^\d{8}$/.test(username)) {
      setError("Not valid username");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          firstSurname,
          secondSurname,
          username,
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Solicitud enviada. Un administrador revisará tu solicitud.");
        setFormData({
          name: "",
          firstSurname: "",
          secondSurname: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        if (
          data.message?.includes("username_format_check") ||
          data.message?.includes("invalid input syntax") ||
          data.message?.includes("invalid input value")
        ) {
          setError("Not valid username");
        } else if (
          data.message?.includes("duplicate key") &&
          data.message?.includes("username")
        ) {
          setError("Username already exists");
        } else if (
          data.message?.includes("duplicate key") &&
          data.message?.includes("email")
        ) {
          setError("Email already registered");
        } else {
          setError(data.message || "Error creating user");
        }
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="signup-screen">
      <video ref={videoRef} autoPlay muted loop playsInline className="signup-video">
        <source src="assets/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <div className="signup-container">
        <img src="assets/kia-logo-white.png" alt="KIA logo" className="signup-logo" />

        <div className="signup-wrapper">
          <div className="signup-left-section">
            <h1>Create Account</h1>
            <p>Already have an account? <Link to="/login">Log In</Link></p>
          </div>

          <div className="signup-right-section">
            <form onSubmit={handleSubmit}>
              <label>Name(s)</label>
              <input type="text" name="name" className="signup-field" value={formData.name} onChange={handleChange} required />
              <label>First Surname</label>
              <input type="text" name="firstSurname" className="signup-field" value={formData.firstSurname} onChange={handleChange} required />
              <label>Second Surname</label>
              <input type="text" name="secondSurname" className="signup-field" value={formData.secondSurname} onChange={handleChange} />
              <label>Username</label>
              <input type="text" name="username" className="signup-field" value={formData.username} onChange={handleChange} required />
              <label>Email</label>
              <input type="email" name="email" className="signup-field" value={formData.email} onChange={handleChange} required />
              <label>Password</label>
              <input type="password" name="password" className="signup-field" value={formData.password} onChange={handleChange} required />
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" className="signup-field" value={formData.confirmPassword} onChange={handleChange} required />

              {error && <p className="signup-error-message">{error}</p>}
              {success && <p className="signup-success-message">{success}</p>}

              <button type="submit" className="signup-button">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}