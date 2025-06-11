import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import "../styles/SessionStarted.css";

export default function SessionStarted() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axiosInstance.get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchUser();
  }, [navigate]);

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

  if (!user) return null;

  const baseSections = [
    {
      title: "Registrar Residuo",
      description: "Registra rápidamente nuevos residuos con formularios inteligentes.",
      icon: "/icons/form.svg",
      path: "/waste-registry",
    },
    {
      title: "Ver Historial",
      description: "Consulta el historial de residuos registrados.",
      icon: "/icons/history.svg",
      path: "/waste-history",
    },
    {
      title: "Dashboard de KPIs",
      description: "Monitorea eficiencia, cumplimiento y tendencias de residuos.",
      icon: "/icons/dashboard.svg",
      path: "/waste-dashboard",
    },
  ];

  const adminSections = [
    {
      title: "Solicitudes",
      description: "Administra solicitudes de usuarios pendientes.",
      icon: "/icons/requests.svg",
      path: "/pending-requests",
    },
    {
      title: "Residuos Confirmados",
      description: "Gestiona residuos confirmados y aprobados.",
      icon: "/icons/documents.svg",
      path: "/waste-registry-confirmed",
    },
  ];

  const sections = user.username === "01234644" ? [...baseSections, ...adminSections] : baseSections;

  return (
    <div className="session-screen">
      <Navbar />

      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="session-video"
      >
        <source src="assets/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <div className="session-main-text">
        <h1 className="session-title">Bienvenido, {user.name}!</h1>
        <p className="session-subtitle">Gestiona eficientemente residuos peligrosos y monitorea KPIs en tiempo real.</p>
      </div>

      <div className="session-container">
        <div className="session-cards">
          {sections.map(({ title, description, icon, path }) => (
            <div
              key={title}
              className="session-card"
              onClick={() => navigate(path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") navigate(path);
              }}
            >
              <img src={icon} alt={title} />
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
