import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import "./Navbar.css";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedUser, setUser] = useState(null); 

  useEffect(() => {
    const fetchUserAndRequests = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const decoded = jwtDecode(token);
        console.log("Token decodificado:", decoded);

        const res = await axiosInstance.get("/dashboard");
        const userFromBackend = res.data.user;

        setUser({
          ...userFromBackend,
          role: decoded.role,
        });
      } catch (err) {
        console.error("Error al cargar usuario:", err);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserAndRequests();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!loggedUser) return null;

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/session-started">
          <img src="/assets/kia-logo-white.png" alt="KIA" style={{ height: "40px" }} />
        </Link>
        <p>{loggedUser.username}</p>
      </div>

      <div className="navbar-routes">
        <div className="pages"> 
          <Link to="/waste-registry">Registry</Link>
          <Link to="/waste-history">History</Link>
          <Link to="/waste-dashboard">Dashboards</Link>
          
          {loggedUser.username === "01234644" && (
            <Link to="/waste-referrals">Referrals</Link>
          )}

          
          {loggedUser.username === "01234644" && (
            <Link to="/user-info">Account</Link>
          )}

          
          {loggedUser.username === "01234644" && (
            <Link to="/pending-requests">Requests</Link>
          )}
        </div>

        <button className="navbar-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
