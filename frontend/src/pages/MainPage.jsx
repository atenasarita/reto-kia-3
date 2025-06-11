import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainPage.css';

export default function MainPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

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

  return (
    <div className="main-page-screen">
      <video ref={videoRef} autoPlay muted className="main-page-video">
        <source src="assets/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <div className="main-page-container">
        <img src="assets/kia-logo-white.png" alt="KIA logo" className="main-page-logo" />
        <h1 className="main-page-title">Waste Management</h1>
        <button className="main-page-button" onClick={() => navigate("/login")}>Log In</button>
        <button className="main-page-button" onClick={() => navigate("/signup")}>Sign Up</button>
      </div>
    </div>
  );
}