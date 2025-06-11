import React from "react";

export default function PendingUserCard({ user, onDecision }) {
  return (
    <div className="pending-card">
      
      <div className="user-info"> 
        <p>
            <strong>{user.name} {user.first_surname}</strong>
        </p>
        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>
      </div>
      <div className="pending-buttons">
        <button
          className="pending-button pending-approve"
          onClick={() => onDecision(user.id, "accept")}
        >
          Aceptar
        </button>
        <button
          className="pending-button pending-reject"
          onClick={() => onDecision(user.id, "reject")}
        >
          Rechazar
        </button>
      </div>
    </div>
  );
}

