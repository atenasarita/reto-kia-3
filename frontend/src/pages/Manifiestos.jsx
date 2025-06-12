import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import ReferralCard from "../components/ReferralCard";
import "../styles/Manifiestos.css";

export default function Manifiestos() {
  const [referrals, setReferrals] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const res = await axiosInstance.get("/referrals");
        setReferrals(res.data);
      } catch (err) {
        console.error("Error al obtener remisiones", err);
      }
    };
    fetchReferrals();
  }, []);

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
    <div className="waste-referrals-screen">
      <Navbar />
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="waste-referrals-video"
      >
        <source src="/assets/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <div className="waste-referrals-container">
        <h1>Manifiestos</h1>

        {referrals.map((ref) => (
          <ReferralCard key={ref.id} referral={ref} />
        ))}
      </div>
    </div>
  );
}
