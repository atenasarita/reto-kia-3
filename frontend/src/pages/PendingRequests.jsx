import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import PendingCard from "../components/PendingUserCard"; 
import "../styles/PendingRequests.css";

export default function PendingRequests() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchUserAndRequests = async () => {
      try {
        const res = await axiosInstance.get("/dashboard");
        const loggedUser = res.data.user;
        setUser(loggedUser);

        const pending = await axiosInstance.get("/users/admin/pending-users");
        setPendingUsers(pending.data);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserAndRequests();
  }, [navigate]);

  const handleDecision = async (id, action) => {
    try {
      if (action === "accept") {
        const res = await axiosInstance.post(`/users/admin/approve/${id}`);
        setFeedback(res.data.message);
      } else if (action === "reject") {
        const res = await axiosInstance.delete(`/users/admin/reject/${id}`);
        setFeedback(res.data.message);
      }
      setPendingUsers((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setFeedback("Error al procesar la solicitud");
    }
  };

  if (!user) return null;

  return (
    <div className="pending-screen">
      <Navbar/>

      <div className="pending-container">
        <h1 className="pending-title">Solicitudes Pendientes</h1>
        {feedback && <p className="pending-feedback">{feedback}</p>}
        {pendingUsers.length === 0 ? (
          <p>No hay solicitudes pendientes</p>
        ) : (
          pendingUsers.map((u) => (
            <PendingCard key={u.id} user={u} onDecision={handleDecision} />
          ))
        )}
      </div>
    </div>
  );
}
