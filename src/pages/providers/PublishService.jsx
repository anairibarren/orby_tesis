import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { supabase } from "../../services/supabase";
// Cambiá ProviderNavbar por tu navbar prestador cuando la tengas
import Navbar from "../../components/Navbar";

export default function PublishService() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);

      // Ajustá campos/relación según tu DB
      // Opción simple: traer servicios con category_id y después mapear categoría si querés
      const { data, error } = await supabase
        .from("services")
        .select("id, name, pricing_type, category_id");

      if (error) console.error(error);
      setServices(data ?? []);
      setLoading(false);
    };

    fetchServices();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter(s => s.name?.toLowerCase().includes(q));
  }, [services, query]);

  const handleContinue = () => {
    if (!selectedService) return;

    switch (selectedService.pricing_type) {
      case "fixed":
        navigate(`/provider/publish/fixed/${selectedService.id}`);
        break;
      case "calculated":
        navigate(`/provider/publish/calculated/${selectedService.id}`);
        break;
      case "quote":
        navigate(`/provider/publish/quote/${selectedService.id}`);
        break;
      default:
        console.warn("pricing_type desconocido:", selectedService.pricing_type);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-32">
      <div className="px-6 pt-6">
        <button onClick={() => navigate(-1)} className="mb-4">
          <Icon icon="ep:arrow-left-bold" className="w-7 h-7 text-black" />
        </button>

        <h1 className="text-2xl font-semibold text-black text-center">
          Publicar servicio
        </h1>

        <div className="mt-8">
          <label className="text-sm font-medium text-black">Servicio</label>
          <p className="text-xs text-[#808080] mt-1">Buscá tu servicio por nombre.</p>

          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedService(null);
            }}
            placeholder="Buscar servicio"
            className="mt-3 w-full bg-white rounded-full px-5 py-4 shadow outline-none"
          />

          <div className="mt-4 space-y-2">
            {loading && <p className="text-sm text-gray-500">Cargando servicios...</p>}

            {!loading && filtered.slice(0, 6).map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedService(s);
                  setQuery(s.name);
                }}
                className={`w-full text-left bg-white rounded-2xl px-5 py-4 shadow
                  ${selectedService?.id === s.id ? "ring-2 ring-[#2A4691]" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black">{s.name}</span>
                  <span className="text-xs text-[#808080]">
                    {s.pricing_type === "fixed" && "Precio fijo"}
                    {s.pricing_type === "calculated" && "Calculable"}
                    {s.pricing_type === "quote" && "Cotización"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Categoría automática (read-only) */}
          <div className="mt-8">
            <label className="text-sm font-medium text-black">Categoría</label>
            <p className="text-xs text-[#808080] mt-1">Se asigna automáticamente.</p>

            <div className="mt-3 w-full bg-[#EFEFEF] rounded-full px-5 py-4 text-[#808080]">
              {selectedService ? `Categoría ID: ${selectedService.category_id}` : "Se completará al elegir un servicio"}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 px-6">
        <button
          onClick={handleContinue}
          disabled={!selectedService}
          className={`w-full py-4 rounded-full font-semibold shadow-xl
            ${selectedService ? "bg-[#1E2F5D] text-white" : "bg-gray-300 text-white"}`}
        >
          Continuar
        </button>
      </div>

      <Navbar />
    </div>
  );
}
