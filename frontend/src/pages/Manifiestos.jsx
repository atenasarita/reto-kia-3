import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import "../styles/Manifiestos.css";

export default function Manifiestos() {
  const [referrals, setReferrals] = useState([]);
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [wasteDetails, setWasteDetails] = useState([]);
  const [groupedSummary, setGroupedSummary] = useState([]);
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

  const handleViewDetail = async (referral) => {
    try {
      setSelectedReferral(referral);

      const resWaste = await axiosInstance.get(`/waste/by-referral/${referral.id}`);
      setWasteDetails(resWaste.data);

      const resGroup = await axiosInstance.get(`/waste/summary/by-referral/${referral.id}`);
      setGroupedSummary(resGroup.data);
    } catch (err) {
      console.error("Error al cargar detalles", err);
    }
  };

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
          <div key={ref.id} className="remision-card">
            <p><strong>Remisión:</strong> {ref.compañia} - {ref.fecha}</p>
            <button className="select-btn" onClick={() => handleViewDetail(ref)}>Ver detalle</button>
          </div>
        ))}

        {selectedReferral && (
          <div className="edit-referral-form">
            <h2>Detalle de la Remisión</h2>
            <p><strong>Chofer:</strong> {selectedReferral.nombre_chofer}</p>
            <p><strong>Placas:</strong> {selectedReferral.placas}</p>
            <p><strong>Contenedor:</strong> {selectedReferral.contenedor}</p>
            <p><strong>Destino:</strong> {selectedReferral.destino}</p>
            <p><strong>Empresa Transportista:</strong> {selectedReferral.compañia}</p>

            <h3>Resumen de residuos</h3>
            <table className="referrals-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Cantidad Total (kg)</th>
                  <th>Registros</th>
                </tr>
              </thead>
              <tbody>
                {groupedSummary.map((item, i) => (
                  <tr key={i}>
                    <td>{item.type}</td>
                    <td>{item.total_amount}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Residuos incluidos</h3>
            <table className="referrals-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th>Contenedor</th>
                  <th>CRETI</th>
                  <th>Area</th>
                </tr>
              </thead>
              <tbody>
                {wasteDetails.map((r, i) => (
                  <tr key={i}>
                    <td>{r.type}</td>
                    <td>{r.amount}</td>
                    <td>{r.container}</td>
                    <td>{r.chemicals?.join(", ")}</td>
                    <td>{r.area}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button className="create-btn">Generar Manifiesto</button>
          </div>
        )}
      </div>
    </div>
  );
}
