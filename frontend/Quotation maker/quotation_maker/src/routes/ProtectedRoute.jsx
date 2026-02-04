import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // check token (adjust if you're using Auth Context)
  const token = sessionStorage.getItem("token"); 
  const token_1=localStorage.getItem("token");
  // or localStorage.getItem("token")
   
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
