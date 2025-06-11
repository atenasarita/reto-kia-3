import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const AdminRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axiosInstance.get("/dashboard");
        const user = res.data.user;

        if (user.username === "01234644") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (err) {
        localStorage.removeItem("token");
        setIsAuthorized(false);
      }
    };

    checkAdmin();
  }, []);

  if (isAuthorized === null) {
    return <p style={{ color: "white", textAlign: "center" }}>Verificando acceso...</p>;
  }

  if (isAuthorized === false) {
    navigate("/session-started");
    return null;
  }

  return children;
};

export default AdminRoute;