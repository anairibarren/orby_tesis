import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Toast from "../../../components/Toast";
import { useAuthContext } from "../../../context/AuthContext";

const EXPERIENCE_OPTIONS = ["0-1", "2-4", "5-9", "10+"];

const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const TIME_SLOTS = ["Mañana (8-12)", "Tarde (13-17)", "Noche (18-20)"];

export default function RegisterDetail() {
  const navigate = useNavigate();
  const certInputRef = useRef(null);
  const { register } = useAuthContext();

  const [step, setStep] = useState(1);

  const base = useMemo(() => {
    const rawProvider = localStorage.getItem("provider_register_data");
    if (rawProvider) return JSON.parse(rawProvider);
    const raw = localStorage.getItem("register_data");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const [presentacion, setPresentacion] = useState("");
  const [experiencia, setExperiencia] = useState("");

  const [days, setDays] = useState([]);
  const [slots, setSlots] = useState([]);

  const [certFiles, setCertFiles] = useState([]);

  // Toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastVariant, setToastVariant] = useState("success");
  const [toastMsg, setToastMsg] = useState("");
  const showToast = (variant, message) => {
    setToastVariant(variant);
    setToastMsg(message);
    setToastOpen(true);
  };

  // Progress
  const [progressPct, setProgressPct] = useState(65);
  useEffect(() => {
    if (step === 1) setProgressPct(65);
    if (step === 2) {
      setProgressPct(65);
      requestAnimationFrame(() => setProgressPct(100));
    }
  }, [step]);

  if (!base) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 font-poppins">
        <p className="text-center text-gray-600">
          Faltan datos del registro. Volvé al paso anterior.
        </p>
        <button
          onClick={() => navigate("/register/provider")}
          className="mt-6 bg-[#1E2F5D] text-white py-3 px-6 rounded-full"
        >
          Volver
        </button>
      </div>
    );
  }

  const toggleItem = (value, list, setList) => {
    if (list.includes(value)) setList(list.filter((x) => x !== value));
    else setList([...list, value]);
  };

  const handleContinueStep1 = () => {
    if (!presentacion?.trim() || !experiencia) {
      showToast("warning", "Completá presentación y experiencia.");
      return;
    }

    const all = {
      ...base,
      presentacion: presentacion.trim(),
      experiencia,
    };

    localStorage.setItem("provider_register_data", JSON.stringify(all));
    localStorage.setItem("register_data", JSON.stringify(all));
    setStep(2);
  };

  const handleFinish = async () => {
    if (days.length === 0 || slots.length === 0) {
      showToast("warning", "Seleccioná al menos 1 día y 1 franja horaria.");
      return;
    }

    const all = {
      ...base,
      availability: { days, slots },
      cert_files_count: certFiles.length,
    };

    localStorage.setItem("provider_register_data", JSON.stringify(all));
    localStorage.setItem("register_data", JSON.stringify(all));

    // ✅ SIGNUP + AUTOLOGIN
    try {
      const email = all.email;
      const password = all.password;

      if (!email || !password) {
        showToast("error", "Faltan email/contraseña del paso anterior.");
        return;
      }

      const { data, error } = await register({ email, password });

      if (error) {
        // ejemplo: Email signups are disabled
        showToast("error", error.message || "Error al registrar");
        return;
      }

      // Si confirm email está ON, puede venir sin session:
      if (!data?.session) {
        showToast(
          "warning",
          "Te enviamos un email para confirmar. Activá 'Confirm email' OFF si querés autologin en dev."
        );
        // igual te mostramos éxito visual:
        navigate("/register/provider/success", { replace: true });
        return;
      }

      // Con session => ya quedó logueado
      navigate("/register/provider/success", { replace: true });
    } catch (e) {
      showToast("error", e?.message || "Error al registrar");
    }
  };

  // Upload handlers
  const openCertPicker = () => certInputRef.current?.click();

  const handleCertChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setCertFiles(files);
    showToast("success", "Archivos cargados correctamente.");
  };

  const onDropCerts = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    setCertFiles(files);
    showToast("success", "Archivos cargados correctamente.");
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // ✅ dashed perfecto (con separación controlada)
  const dashedSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      <rect x="1.5" y="1.5" width="97" height="97" rx="18" ry="18"
        fill="none" stroke="#E1E1E1" stroke-width="3"
        stroke-dasharray="8 10" />
    </svg>
  `);

  const dashedStyle = {
    backgroundImage: `url("data:image/svg+xml,${dashedSvg}")`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] relative font-poppins">
      <Toast
        open={toastOpen}
        variant={toastVariant}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />

      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 bg-white shadow-lg rounded-full flex items-center justify-center w-[43px] h-[43px] z-10"
      >
        <Icon icon="ep:arrow-left-bold" className="w-[18.69px] h-[18.69px] text-[#3B3B3B]" />
      </button>

      <h1 className="text-center text-xl pt-8 font-semibold text-[#3B3B3B]">
        {step === 1 ? "Perfil público" : "Disponibilidad"}
      </h1>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="px-6 pt-10 max-w-md mx-auto pb-[calc(24px+env(safe-area-inset-bottom))]">
          <div className="mb-8">
            <h2 className="font-semibold mb-1 ml-2">Presentación</h2>
            <p className="text-sm ml-2 text-[#7A7A7A] mb-3">Contá quién sos y qué ofrecés.</p>

            <textarea
              value={presentacion}
              onChange={(e) => setPresentacion(e.target.value)}
              placeholder="Ej: Soy profesora de inglés con experiencia en clases online y presenciales..."
              rows={4}
              className="w-full bg-white shadow-sm rounded-2xl px-4 py-4 outline-none resize-none placeholder:text-[#AAAAAA] placeholder:font-light"
            />
          </div>

          {/* ✅ 4 chips en una sola fila SIEMPRE */}
          <div className="mb-8">
            <h2 className="font-semibold mb-1 ml-2">Experiencia</h2>
            <p className="text-sm ml-2 text-[#7A7A7A] mb-4">Años de experiencia</p>

            <div className="grid grid-cols-4 gap-2">
              {EXPERIENCE_OPTIONS.map((exp) => {
                const selected = experiencia === exp;
                return (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setExperiencia(exp)}
                    className={[
                      "h-12 rounded-full shadow-sm flex items-center justify-center gap-1 min-w-0",
                      selected
                        ? "bg-[#CFE0FF] text-[#1E2F5D] font-semibold"
                        : "bg-white text-[#2B2B2B] font-medium",
                    ].join(" ")}
                  >
                    {selected && (
                      <Icon icon="mdi:check-bold" className="w-6 h-6 text-[#1E2F5D]" />
                    )}
                    <span className="text-[14px] leading-none truncate">{exp}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload */}
          <div className="mb-10">
            <h2 className="font-semibold mb-1 ml-2">Certificados / matrícula</h2>
            <p className="text-sm ml-2 text-[#7A7A7A] mb-3">
              Sumá documentación para generar confianza
            </p>

            <button
              type="button"
              onClick={openCertPicker}
              onDrop={onDropCerts}
              onDragOver={onDragOver}
              className="w-full bg-white rounded-2xl py-10 px-6 flex flex-col items-center justify-center cursor-pointer"
              style={dashedStyle}
            >
              <Icon icon="mdi:cloud-upload-outline" className="w-12 h-12 text-[#7A7A7A] mb-3" />
              <p className="text-[#474747] font-semibold text-lg text-center">
                Subí tus archivos aquí o arrastralos
              </p>
              <p className="text-sm text-[#938F8F] font-light text-center mt-1">
                en formato PDF, JPG o PNG
              </p>

              {certFiles.length > 0 && (
                <p className="text-sm text-[#1E2F5D] font-medium mt-4">
                  {certFiles.length} archivo(s) seleccionado(s)
                </p>
              )}
            </button>

            <input
              ref={certInputRef}
              type="file"
              accept=".pdf,image/*"
              multiple
              className="hidden"
              onChange={handleCertChange}
            />
          </div>

          <button
            type="button"
            onClick={handleContinueStep1}
            className="w-full bg-[#1E2F5D] text-white py-4 rounded-full font-medium mb-6 shadow-md"
          >
            Continuar
          </button>

          <div className="w-full h-2 bg-[#DDE0E7] rounded-full mb-6">
            <div
              className="h-2 bg-[#1E2F5D] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 2 (botón + progress abajo de todo) */}
      {step === 2 && (
        <div
          className="
            px-6 pt-10 max-w-md mx-auto
            flex flex-col
            min-h-[calc(100vh-88px)]
            pb-[calc(24px+env(safe-area-inset-bottom))]
          "
        >
          <div>
            <div className="mb-8">
              <h2 className="font-semibold mb-1 ml-2">Días disponibles</h2>
              <p className="text-sm ml-2 text-[#7A7A7A] mb-4">
                Seleccioná los días que ofrecés servicio
              </p>

              <div className="grid grid-cols-3 gap-3">
                {DAYS.map((day) => {
                  const selected = days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleItem(day, days, setDays)}
                      className={[
                        "rounded-full py-3 text-center shadow-sm transition flex items-center justify-center gap-2",
                        selected
                          ? "bg-[#CFE0FF] text-[#1E2F5D] font-semibold"
                          : "bg-white text-[#2B2B2B] font-medium",
                      ].join(" ")}
                    >
                      {selected && (
                        <Icon icon="mdi:check-bold" className="w-6 h-6 text-[#1E2F5D]" />
                      )}
                      <span>{day}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-10">
              <h2 className="font-semibold mb-1 ml-2">Franja horaria</h2>
              <p className="text-sm ml-2 text-[#7A7A7A] mb-4">
                Elegí las franjas en las que solés trabajar
              </p>

              <div className="grid grid-cols-2 gap-4">
                {TIME_SLOTS.map((time) => {
                  const selected = slots.includes(time);
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => toggleItem(time, slots, setSlots)}
                      className={[
                        "rounded-full py-3 text-center shadow-sm transition flex items-center justify-center gap-2",
                        selected
                          ? "bg-[#CFE0FF] text-[#1E2F5D] font-semibold"
                          : "bg-white text-[#2B2B2B] font-medium",
                      ].join(" ")}
                    >
                      {selected && (
                        <Icon icon="mdi:check-bold" className="w-6 h-6 text-[#1E2F5D]" />
                      )}
                      <span>{time}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex-1" />

          <div>
            <button
              type="button"
              onClick={handleFinish}
              className="w-full bg-[#1E2F5D] text-white py-4 rounded-full font-medium mb-6 shadow-md"
            >
              Continuar
            </button>

            <div className="w-full h-2 bg-[#DDE0E7] rounded-full">
              <div
                className="h-2 bg-[#1E2F5D] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
