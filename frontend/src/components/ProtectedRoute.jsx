import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useAuth();
  const loc = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
}
