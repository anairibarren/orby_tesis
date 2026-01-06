import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegisterSuccess() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    requestAnimationFrame(() => setProgress(100));

    // auto a home (prestador) a los 1.2s
    const t = setTimeout(() => {
      navigate("/", { replace: true });
      // si tu “home prestador” es otro:
      // navigate("/provider/publish", { replace: true });
    }, 1200);

    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-poppins relative">
      <div className="min-h-screen flex flex-col px-8 pt-[200px] pb-[calc(env(safe-area-inset-bottom)+28px)] relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-56 bg-gradient-to-t from-[#F5F5F5] via-[#F5F5F5] to-transparent z-0" />

        <div className="relative z-10">
          <h2 className="text-[2.1rem] font-bold text-[#1E2F5D] mb-6 leading-tight">
            Ahora sí, ¡Todo listo <br />
            para empezar!
          </h2>

          <p className="text-[#4C4C4C] font-light max-w-[22rem]">
            Tu perfil fue creado con éxito. Ahora ya podés explorar Orby y comenzar a conectar con la comunidad.
          </p>
        </div>

        <div className="flex-1" />

        <div className="relative z-10">
          <button
            type="button"
            onClick={() => navigate("/", { replace: true })}
            className="w-full bg-[#1E2F5D] text-white py-4 rounded-full font-medium shadow-md"
          >
            Empezar
          </button>

          <div className="w-full h-2 bg-[#DDE0E7] rounded-full mt-8">
            <div
              className="h-2 bg-[#1E2F5D] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
