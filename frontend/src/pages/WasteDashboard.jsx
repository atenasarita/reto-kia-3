import React, { useEffect, useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import "../styles/WasteDashboard.css";

export default function WasteDashboard() {
  const videoRef = useRef(null);
  const [byType, setByType] = useState([]);
  const [byArea, setByArea] = useState([]);
  const [summary, setSummary] = useState({ total: 0, areas: [] });
  const [monthlyData, setMonthlyData] = useState([]);

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
    const fetchSummary = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const res = await axiosInstance.get("/residuos-por-area", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const areas = res.data.map((item) => ({
          area: item.area,
          amount: parseInt(item.cantidad, 10),
        }));
  
        const total = areas.reduce((acc, item) => acc + item.amount, 0);
        setSummary({ total, areas });
      } catch (error) {
        console.error("Error al obtener residuos por área:", error);
      }
    };
  
    fetchSummary();
  }, []);
  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
  
        const res = await axiosInstance.get("/residuos-por-mes", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = res.data.map(item => ({
          name: item.mes,
          value: parseInt(item.cantidad, 10),
        }));
  
        setMonthlyData(data);
      } catch (error) {
        console.error("Error al obtener residuos por mes:", error);
      }
    };
  
    fetchMonthly();
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
          <h2>Distribución por Mes</h2>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={monthlyData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {monthlyData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a83279", "#246bce"][index % 6]} />
        ))}
      </Pie>
      <Legend />
    </PieChart>
  </ResponsiveContainer>
          </div>

          <div className="dashboard-card">
          <p>Total de residuos registrados: <strong>{summary.total}</strong></p>
          <h2>Distribución por Area</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary.areas}>
              <XAxis dataKey="area" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>
      </div>

        <div className="session-dashboard">
  
</div>

      
    </div>
  );
}
