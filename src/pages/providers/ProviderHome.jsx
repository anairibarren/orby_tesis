import React from "react";
import { useAuthContext } from "../../context/AuthContext";

export default function ProviderHome() {
  const { profile } = useAuthContext();

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-poppins px-6 pt-10">
      <h1 className="text-2xl font-semibold text-[#1E2F5D]">
        Home Prestador
      </h1>

      <p className="mt-2 text-[#4C4C4C]">
        Hola {profile?.full_name || "prestador"} 👋
      </p>

      <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
        <p className="text-[#3B3B3B] font-medium">
          Acá va tu dashboard: solicitudes, servicios publicados, estado, etc.
        </p>
      </div>
    </div>
  );
}
