import React from "react";
import { Navigate } from "react-router-dom";
import { useProviderContext } from "../context/ProviderContext";

export default function ProviderOnly({ children }) {
  const { isProvider, providerLoading } = useProviderContext();

  if (providerLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!isProvider) return <Navigate to="/" replace />;

  return children;
}
