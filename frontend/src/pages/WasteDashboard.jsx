import React, { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import "../styles/WasteDashboard.css";

export default function WasteDashboard() {
  const videoRef = useRef(null);
  const [byType, setByType] = useState([]);
  const [byArea, setByArea] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/dashboard/general-kpis"); // ← esta ruta la conectarás después
        setByType(res.data.byType);
        setByArea(res.data.byArea);
      } catch (err) {
        console.error("Error loading KPIs", err);
      }
    };
    fetchData();
  }, []);

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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="waste-dashboard-screen">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="waste-dashboard-video"
      >
        <source src="assets/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <div className="waste-dashboard-container">
        <Navbar />
        <h1 className="waste-dashboard-title">Dashboard General de Residuos</h1>

        <div className="waste-dashboard-graphs">
          <div className="dashboard-card">
            <h3>Top 5 Tipos de Residuos</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={byType}>
                <XAxis dataKey="type" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-card">
            <h3>Generación por Área</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={byArea}
                  dataKey="amount"
                  nameKey="area"
                  outerRadius={80}
                  label
                >
                  {byArea.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}