import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axiosInstance from "../utils/axiosInstance";
import "../styles/WasteHistory.css";
import PendingRegistryCard from "../components/PendingRegistryCard"; 

export default function WasteHistory() {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axiosInstance.get("/waste", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setRecords(res.data);
      } catch (err) {
        console.error("Error al cargar registros pendientes", err);
      }
    };

    fetchRecords();
  }, []);


  // funciones temporales
  const handleConfirm = async (id) => {
    try {
      await axiosInstance.post(`/waste/confirm/${id}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRecords((prev) => prev.filter((rec) => rec.id !== id));
    } catch (err) {
      if (err.response) {
        alert(`${err.response.data.message || err.response.data.error}`);
      } else {
        alert("Error inesperado");
      }
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/waste/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      setRecords((prev) => prev.filter((rec) => rec.id !== id));
    } catch (err) {
      console.error("Error al eliminar el registro", err);
    }
  };
  

  const handleEdit = (id) => {
    navigate(`/waste-registry/${id}`);
  };

  return (
    <div className="history-screen">

      <Navbar />


      <div className="history-container">
        <h1 className="history-title">Historial de Residuos</h1>
          {records.length === 0 ? (
          <p>No hay solicitudes pendientes</p>
        ) : (
          records.map((record) => (
            <PendingRegistryCard
              key={record.id}
              registry={record}
              onConfirm={handleConfirm}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
