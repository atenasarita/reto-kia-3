import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000;
    if (Date.now() > exp) throw new Error("Token expired");
  } catch (e) {
    return <Navigate to="/login" replace />;
  }

  return children;
}