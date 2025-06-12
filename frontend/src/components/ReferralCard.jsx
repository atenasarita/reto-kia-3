import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import "./ReferralCard.css";

export default function ReferralCard({ referral }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [wasteDetails, setWasteDetails] = useState([]);
  const [groupedSummary, setGroupedSummary] = useState([]);
  const [refer, setRefer] = useState([]);

  const [formData, setFormData] = useState({
    folio: "",
    nombre_responsable: "",
    telefono_responsable: "",
    correo_responsable: "",
    numero_licencia_transportista: "",
    empresa_transportista: referral.compañia || "",
    placas_transportista: referral.placas || "",
    destino: referral.destino || "",
    comentarios: "",
    firma_responsable: "",
  });

  const toggleDetail = async () => {
    if (!showDetail) {
      try {
        const resWaste = await axiosInstance.get(`/waste/by-referral/${referral.id}`);
        setWasteDetails(resWaste.data);
        
        setRefer(referral.id);

        const resGroup = await axiosInstance.get(`/waste/summary/by-referral/${referral.id}`);
        setGroupedSummary(resGroup.data);
      } catch (err) {
        console.error("Error al cargar datos de remisión", err);
      }
    }
    setShowDetail(!showDetail);
    setShowForm(false);
  };

  const handleGenerateManifest = async () => {
    try {
      // Primero guarda el manifiesto
      console.log(refer);

       await axiosInstance.post(`/manifiestos/generate-manifest/${refer}`, {
        ...formData,
        referral_id: referral.id,
      });
  
      alert("Manifiesto guardado correctamente");
  
      /* Luego prepara los datos para el Excel
      const manifestData = {
        transportista: referral.compañia,
        placas: referral.placas,
        fecha: referral.fecha,
        numeroRemision: referral.numero_remision || referral.id,
      };
  
      const wasteRecords = wasteDetails.map((r) => ({
        tipo: r.type,
        cantidad: r.amount,
        contenedor: r.container,
        area: r.area,
      }));
  
      const summaryData = groupedSummary.map((s) => ({
        tipo: s.type,
        contenedor: s.container,
        totalKg: s.total_kg,
        registros: s.count,
      }));
  
      // Solicita el archivo Excel
      const response = await fetch("http://localhost:3000/api/manifiestos/export-excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ manifestData, wasteRecords, summaryData }),
      });
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `manifiesto_${referral.id}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);*/
  
      // Limpia el formulario
      setShowForm(false);
    } catch (error) {
      console.error("Error al guardar o descargar manifiesto:", error);
      alert("Ocurrió un error al generar el manifiesto");
    }
  };
  

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/manifiestos", {
        ...formData,
        referral_id: referral.id,
      });
      alert("Manifiesto guardado correctamente");
      setShowForm(false);
    } catch (err) {
      console.error("Error al guardar manifiesto", err);
      alert("Ocurrió un error al guardar el manifiesto");
    }
  };


  const downloadExcel = async () => {
    const manifestData = {
      transportista: referral.compañia,
      placas: referral.placas,
      fecha: referral.fecha,
      numeroRemision: referral.numero_remision || referral.id, // usa `id` si no tienes `numero_remision`
    };
  
    const wasteRecords = wasteDetails.map((r) => ({
      tipo: r.type,
      cantidad: r.amount,
      contenedor: r.container,
      area: r.area,
    }));
  
    const summaryData = groupedSummary.map((s) => ({
      tipo: s.type,
      contenedor: s.container,
      totalKg: s.total_kg,
      registros: s.count,
    }));
  
    try {
      const response = await fetch("http://localhost:3000/api/manifiestos/export-excel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manifestData,
          wasteRecords,
          summaryData,
        }),
      });
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `manifiesto_${referral.id}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error al descargar Excel:", err);
    }
  };  
  

  return (
    <div className="remision-card">
      <p><strong>Transportista:</strong> {referral.compañia}</p>
      <p><strong>Fecha:</strong> {referral.fecha}</p>
      <button className="select-btn" onClick={toggleDetail}>
        {showDetail ? "Ocultar detalle" : "Mostrar detalle"}
      </button>

      {showDetail && (
        <div className="edit-referral-form">
          <h2>Detalle de la Remisión</h2>
          <p><strong>Chofer:</strong> {referral.nombre_chofer}</p>
          <p><strong>Placas:</strong> {referral.placas}</p>
          <p><strong>Fecha de salida:</strong> {referral.fecha}</p>
          <p><strong>Empresa transportista:</strong> {referral.compañia}</p>
          <p><strong>Destino:</strong> {referral.destino}</p>

          <h3>Resumen agrupado</h3>
          <table className="referrals-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Contenedor</th>
                <th>Total (kg)</th>
                <th>Registros</th>
              </tr>
            </thead>
            <tbody>
              {groupedSummary.map((item, i) => (
                <tr key={i}>
                  <td>{item.type}</td>
                  <td>{item.container}</td>
                  <td>{item.total_kg}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Registros individuales</h3>
          <table className="referrals-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Cantidad (ton)</th>
                <th>Contenedor</th>
                <th>Área</th>
              </tr>
            </thead>
            <tbody>
              {wasteDetails.map((r, i) => (
                <tr key={i}>
                  <td>{r.type}</td>
                  <td>{r.amount}</td>
                  <td>{r.container}</td>
                  <td>{r.area}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="create-btn" onClick={handleGenerateManifest}>
            Generar Manifiesto
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="generate-manifest-form">
              <h3>Formulario del Manifiesto</h3>

              <label>Folio:</label>
              <input
                type="text"
                name="folio"
                value={formData.folio}
                onChange={handleChange}
                required
              />

              <label>Nombre responsable:</label>
              <input
                type="text"
                name="nombre_responsable"
                value={formData.nombre_responsable}
                onChange={handleChange}
                required
              />

              <label>Teléfono responsable:</label>
              <input
                type="tel"
                name="telefono_responsable"
                value={formData.telefono_responsable}
                onChange={handleChange}
              />

              <label>Correo responsable:</label>
              <input
                type="email"
                name="correo_responsable"
                value={formData.correo_responsable}
                onChange={handleChange}
              />

              <label>Número licencia transportista:</label>
              <input
                type="text"
                name="numero_licencia_transportista"
                value={formData.numero_licencia_transportista}
                onChange={handleChange}
              />

              <label>Empresa transportista:</label>
              <input
                type="text"
                name="empresa_transportista"
                value={formData.empresa_transportista}
                onChange={handleChange}
              />

              <label>Placas transportista:</label>
              <input
                type="text"
                name="placas_transportista"
                value={formData.placas_transportista}
                onChange={handleChange}
              />

              <label>Destino:</label>
              <input
                type="text"
                name="destino"
                value={formData.destino}
                onChange={handleChange}
              />

              <label>Comentarios:</label>
              <textarea
                name="comentarios"
                value={formData.comentarios}
                onChange={handleChange}
              />

              <label>Firma responsable (URL o texto):</label>
              <input
                type="text"
                name="firma_responsable"
                value={formData.firma_responsable}
                onChange={handleChange}
              />

<button type="button" className="create-btn" onClick={handleGenerateManifest}>
  Generar Manifiesto
</button>


            </form>
          )}
        </div>
      )}
    </div>
  );
}
