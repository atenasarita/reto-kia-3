import React from "react";
import "./PendingRegistryCard.css"; 

export default function PendingRegistryCard({ registry, onConfirm, onEdit, onDelete }) {
  return (
    
    <div className="waste-card">
      <div className="waste-info-grid">
        <div>
          <p><strong>Fecha de ingreso:</strong> {registry.entry_date}</p>
          <p><strong>Tipo de residuo:</strong> {registry.type}</p>
          <p><strong>Cantidad:</strong> {registry.amount} toneladas</p>
          <p><strong>Contenedor:</strong> {registry.container}</p>
          <p><strong>Área:</strong> {registry.area}</p>
          <p><strong>Artículo 71:</strong> {registry.art71}</p>
        </div>

        <div>
          <p><strong>Razón social:</strong> {registry.reason_art71}</p>
          <p><strong>Aut. SEMARNAT:</strong> {registry.aut_semarnat}</p>
          <p><strong>Aut. SCT:</strong> {registry.aut_sct}</p>
          <p><strong>Destino:</strong> {registry.reason_destination}</p>
          <p><strong>Aut. Destino:</strong> {registry.aut_destination}</p>
          <p>
            <strong>CRETI:</strong>{" "}
            {registry.chemicals}
          </p>       
          <p><strong>Responsable:</strong> {registry.responsible}</p>
        </div>
      </div>

      <div className="waste-card-buttons">
        <button className="btn-confirm" onClick={() => onConfirm(registry.id)} >Confirmar</button>
        <button className="btn-edit" onClick={() => onEdit(registry.id)}>Editar</button>
        <button className="btn-delete" onClick={() => onDelete(registry.id)} >Eliminar</button>
      </div>
    </div>
  );
}
