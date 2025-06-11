import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosInstance";
import "../styles/WasteReferrals.css";

export default function WasteReferrals() {
  const [eligibleRecords, setEligibleRecords] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [groupedSums, setGroupedSums] = useState([]);
  const [filter, setFilter] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const videoRef = useRef(null);

  useEffect(() => {
    // Limpia los seleccionados al cargar el componente o vista
    const clearSelections = async () => {
      await axiosInstance.put('/waste/clear-selected');
    };
  
    clearSelections();
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
  

  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        const response = await axiosInstance.get(`/waste/eligible?reason=${filter}`);
        setEligibleRecords(response.data);
      } catch (error) {
        console.error("Error al cargar los datos filtrados:", error);
      }
    };
    fetchFilteredData();

    
  }, [filter]);

  useEffect(() => {
    const fetchGroupedSums = async () => {
      if (!editData.reason_art71) return;
      try {
        const res = await axiosInstance.get(`/waste/amount-sum/${editData.reason_art71}`);

        
        setGroupedSums(res.data);

      } catch (error) {
        console.error("Error al obtener las sumas agrupadas:", error);
        setGroupedSums([]); 
      }
    };
  
    fetchGroupedSums();
  }, [editData.reason_art71]);

  const handleFilterChange = (e) => setFilter(e.target.value);

  const handleSelect = async (record) => {
    try {
      // Marcar en la base de datos como seleccionado
      await axiosInstance.put(`/waste/select/${record.id}`, {selected: true});
  
      // Mover a la tabla de seleccionados
      setSelectedRecords((prev) => [...prev, record]);
      setEligibleRecords((prev) => prev.filter((r) => r.id !== record.id));
    } catch (error) {
      console.error("Error al seleccionar el registro:", error);
    }
  };

  const handleReturn = async (record) => {
    try{
      await axiosInstance.put(`/waste/select/${record.id}`, {selected: false});

      setEligibleRecords((prev) => [...prev, record]);
      setSelectedRecords((prev) => prev.filter((r) => r.id !== record.id));
    } catch (error){
      console.error("Error al devolver el registro:", error);
      alert("Ocurrió un error al devolver el registro. Inténtalo de nuevo.");
    }
  };

  const handleEdit = async (record) => {
    try {
      // Asegurar que el registro esté marcado como seleccionado
      await axiosInstance.put(`/waste/select/${record.id}`, {selected: true});
      
      setIsEditing(true);
      setEditData(record);

    } catch (error) {
      console.error("Error al preparar edición:", error);
    }
  };
  

  const handleCreateReferral = async () => {
    try {

      const referralData = {
        fecha: editData.fecha,
        nombre_chofer: editData.nombre_chofer,
        hora_salida: editData.hora_salida,
        compañia: editData.reason_art71,
        destino: editData.destino,
        contenedor: editData.contenedor,
        placas: editData.placas,
        num_econ: editData.num_econ,
        firma: editData.firma
      };

      await axiosInstance.post("/referrals", referralData);

      alert("Remisión creada con éxito");
      setSelectedRecords([]);
      setIsEditing(false);
    } catch (error) {
      console.error("Error creating referral", error);
      alert("Error al crear la remisión");
    }
  };

  const uniqueReasons = [
    'LAURA MIREYA NAVARRO CEPEDA',
    'SERVICIOS AMBIENTALES INTERNACIONALES S. DE RL. DE C.V.',
    'ECO SERVICIOS PARA GAS S.A. DE CV.',
    'CONDUGAS DEL NORESTE S.A. DE C.V.'
  ];

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
        <source src="assets/kia-bg.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      <div className="waste-referrals-container">
        <h1>Confirmed Records</h1>
        <div className="filter-section">
          <label>Filter by Reason (art. 71): </label>
          <select value={filter} onChange={handleFilterChange}>
            <option value="">All</option>
            {uniqueReasons.map((r, i) => (
              <option key={i} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="confirmed-records-section">
          <h2>Confirmed Records</h2>
          <table className="referrals-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Container</th>
                <th>Area</th>
                <th>Reason</th>
                <th>Select</th>
              </tr>
            </thead>
            <tbody>
              {eligibleRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.type}</td>
                  <td>{record.amount}</td>
                  <td>{record.container}</td>
                  <td>{record.area}</td>
                  <td>{record.reason_art71}</td>
                  <td>
                    <button
                      className="select-btn"
                      onClick={() => handleSelect(record)}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="selected-records-section">
          <h2>Selected Records</h2>
          <table className="referrals-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Container</th>
                <th>Area</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {selectedRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.type}</td>
                  <td>{record.amount}</td>
                  <td>{record.container}</td>
                  <td>{record.area}</td>
                  <td>{record.reason_art71}</td>
                  <td>
                    <button
                      className="return-btn"
                      onClick={() => handleReturn(record)}
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="edit-referral-button-container">
          <button
            className="edit-btn"
            onClick={() => handleEdit(selectedRecords[0])}
          > Edit Referral
          </button>
        </div>

        {isEditing && (
          <div className="edit-referral-form">
            <h2>Edit Referral</h2>
            <div className="grouped-records-section">
              <h2>Grouped Residue Types and Amounts</h2>
              <table className="referrals-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                {Array.isArray(groupedSums) && groupedSums.map((item, index) => (
                    <tr key={index}>
                      <td>{item.type}</td>
                      <td>{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <form onSubmit={handleCreateReferral}>
              <label>Fecha:</label>
              <input type="date" value={editData.fecha || ""} onChange={(e) => setEditData({ ...editData, fecha: e.target.value })} />
              <label>Nombre del Chofer:</label>
              <input type="text" value={editData.nombre_chofer || ""} onChange={(e) => setEditData({ ...editData, nombre_chofer: e.target.value })} />
              <label>Hora de Salida:</label>
              <input type="time" value={editData.hora_salida || ""} onChange={(e) => setEditData({ ...editData, hora_salida: e.target.value })} />
              <label>Compañía:</label>
              <input type="text" value={editData.reason_art71} disabled />
              <label>Destino:</label>
              <input type="text" value={editData.destino || ""} onChange={(e) => setEditData({ ...editData, destino: e.target.value })} />
              <label>Contenedor:</label>
              <input type="text" value={editData.contenedor || ""} onChange={(e) => setEditData({ ...editData, contenedor: e.target.value })} />
              <label>Placas:</label>
              <input type="text" value={editData.placas || ""} onChange={(e) => setEditData({ ...editData, placas: e.target.value })} />
              <label>Número Económico:</label>
              <input type="text" value={editData.num_econ || ""} onChange={(e) => setEditData({ ...editData, num_econ: e.target.value })} />
              <label>Firma:</label>
              <input type="text" value={editData.firma || ""} onChange={(e) => setEditData({ ...editData, firma: e.target.value })} />
              <button type="submit" className="create-btn">Create Referral</button>
            </form>
          </div>
        )}

    
      </div>
    </div>
  );
}