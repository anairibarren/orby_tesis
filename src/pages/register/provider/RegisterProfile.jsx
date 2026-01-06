import React, { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Toast from "../../../components/Toast";

const BARRIOS_VL = [
  "Vicente López",
  "Olivos",
  "Florida",
  "Florida Oeste",
  "La Lucila",
  "Munro",
  "Villa Martelli",
  "Carapachay",
  "Villa Adelina",
];

function onlyDigits(value = "") {
  return value.replace(/\D/g, "");
}

function formatArPhone(digits) {
  const d = onlyDigits(digits).slice(0, 10);
  const p1 = d.slice(0, 2);
  const p2 = d.slice(2, 6);
  const p3 = d.slice(6, 10);
  return [p1, p2, p3].filter(Boolean).join(" ");
}

export default function RegisterProfile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [step, setStep] = useState(1);

  // Form
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [phoneDigits, setPhoneDigits] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSelected, setLocationSelected] = useState("");
  const [locationFocused, setLocationFocused] = useState(false);

  // Toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastVariant, setToastVariant] = useState("success");
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (variant, message) => {
    setToastVariant(variant);
    setToastMsg(message);
    setToastOpen(true);
  };

  const filteredBarrios = useMemo(() => {
    const q = locationQuery.trim().toLowerCase();
    if (!q) return BARRIOS_VL;
    return BARRIOS_VL.filter((b) => b.toLowerCase().includes(q));
  }, [locationQuery]);

  const canContinue = useMemo(() => {
    const nameOk = fullName.trim().length >= 3;
    const emailOk = email.trim().includes("@");
    const passOk = password.trim().length >= 6;
    const phoneOk = onlyDigits(phoneDigits).length >= 10;
    const locOk = !!locationSelected;
    const avatarOk = !!avatarFile;
    return nameOk && emailOk && passOk && phoneOk && locOk && avatarOk;
  }, [fullName, email, password, phoneDigits, locationSelected, avatarFile]);

  const handlePickAvatar = () => fileRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const selectBarrio = (barrio) => {
    setLocationSelected(barrio);
    setLocationQuery(barrio);
    setLocationFocused(false);
  };

  const handleNext = () => {
    if (!canContinue) {
      showToast("warning", "Completá todos los campos para continuar.");
      return;
    }

    const payload = {
      role: "provider",
      fullName: fullName.trim(),
      email: email.trim(),
      password, // (para dev) luego lo podés sacar
      phone: "+54" + onlyDigits(phoneDigits),
      location: locationSelected,
      avatarPreview,
    };

    localStorage.setItem("provider_register_data", JSON.stringify(payload));
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] relative font-poppins">
      <Toast
        open={toastOpen}
        variant={toastVariant}
        message={toastMsg}
        onClose={() => setToastOpen(false)}
      />

      {step === 1 && (
        <>
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 bg-white shadow-lg rounded-full flex items-center justify-center w-[43px] h-[43px]"
          >
            <Icon
              icon="ep:arrow-left-bold"
              className="w-[18.69px] h-[18.69px] text-[#3B3B3B]"
            />
          </button>

          <h1 className="text-center text-xl pt-8 font-semibold text-[#3B3B3B]">
            Creá tu cuenta
          </h1>

          <div className="px-6 pt-10 max-w-md mx-auto pb-[calc(24px+env(safe-area-inset-bottom))]">
            {/* Avatar obligatorio */}
            <div className="flex flex-col items-center mb-10">
              <div className="relative w-28 h-28 rounded-full bg-[#E5E5E5] flex items-center justify-center overflow-visible">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <Icon icon="mdi:account" className="w-12 h-12 text-[#9A9A9A]" />
                )}

                <button
                  type="button"
                  onClick={handlePickAvatar}
                  className="absolute -bottom-1 -right-1 bg-[#1E2F5D] w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                  aria-label="Subir foto"
                >
                  <Icon
                    icon="material-symbols:add-rounded"
                    className="w-7 h-7 text-white"
                  />
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <p className="mt-4 text-sm text-[#A7A7A7] font-light">
                Agregá tu foto de perfil
              </p>
            </div>

            {/* Datos básicos */}
            <div className="mb-6">
              <p className="font-semibold mb-3 ml-2">Datos básicos</p>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nombre completo"
                className="w-full bg-white shadow-sm rounded-full px-5 py-4 outline-none placeholder:text-[#AAAAAA] placeholder:font-light"
              />

              <div className="h-3" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full bg-white shadow-sm rounded-full px-5 py-4 outline-none placeholder:text-[#AAAAAA] placeholder:font-light"
                autoComplete="email"
              />

              <div className="h-3" />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full bg-white shadow-sm rounded-full px-5 py-4 outline-none pr-12 placeholder:text-[#AAAAAA] placeholder:font-light"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B6B6B]"
                  aria-label="Ver contraseña"
                >
                  <Icon
                    icon={showPassword ? "mdi:eye-off" : "mdi:eye"}
                    className="w-6 h-6"
                  />
                </button>
              </div>
            </div>

            {/* Contacto */}
            <div className="mb-6">
              <p className="font-semibold mb-3 ml-2">Contacto</p>

              <div className="flex gap-3">
                <div className="bg-white shadow-sm rounded-full px-4 py-3 flex items-center gap-2">
                  <Icon icon="twemoji:flag-argentina" className="w-5 h-5" />
                  <span className="text-sm text-[#3B3B3B] font-medium">+54</span>
                </div>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={formatArPhone(phoneDigits)}
                  onChange={(e) => setPhoneDigits(onlyDigits(e.target.value))}
                  placeholder="Escribí tu número"
                  className="flex-1 bg-white shadow-sm rounded-full px-5 py-4 outline-none placeholder:text-[#AAAAAA] placeholder:font-light"
                />
              </div>

              <p className="text-xs text-[#8A8A8A] mt-2 ml-2 font-light">
                Es solo para coordinar el servicio (no se comparte públicamente).
              </p>
            </div>

            {/* Ubicación */}
            <div className="mb-8 relative">
              <p className="font-semibold mb-3 ml-2">Ubicación</p>

              <input
                type="text"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setLocationSelected("");
                }}
                onFocus={() => setLocationFocused(true)}
                onBlur={() => {
                  const exact = BARRIOS_VL.find(
                    (b) => b.toLowerCase() === locationQuery.trim().toLowerCase()
                  );
                  if (exact) setLocationSelected(exact);
                  setTimeout(() => setLocationFocused(false), 120);
                }}
                placeholder="Escribí tu barrio"
                className="w-full bg-white shadow-sm rounded-full px-5 py-4 outline-none placeholder:text-[#AAAAAA] placeholder:font-light"
              />

              {locationFocused && filteredBarrios.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="max-h-52 overflow-auto">
                    {filteredBarrios.map((barrio) => (
                      <button
                        type="button"
                        key={barrio}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          selectBarrio(barrio);
                        }}
                        className="w-full text-left px-5 py-3 hover:bg-[#F5F5F5] transition text-[#2B2B2B]"
                      >
                        {barrio}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canContinue}
              className={[
                "w-full py-4 rounded-full font-medium transition shadow-md",
                canContinue
                  ? "bg-[#1E2F5D] text-white"
                  : "bg-[#DDE0E7] text-[#8D8D8D] cursor-not-allowed",
              ].join(" ")}
            >
              Continuar
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="min-h-screen flex flex-col bg-[#F5F5F5] px-8 pt-[200px] pb-[calc(env(safe-area-inset-bottom)+32px)] relative overflow-hidden">
          <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-48 bg-gradient-to-t from-[#F5F5F5] via-[#F5F5F5] to-transparent z-0" />

          <div className="relative z-10">
            <h2 className="text-[2.1rem] font-bold text-[#1E2F5D] mb-6 leading-tight">
              Un último paso <br />
              antes de comenzar
            </h2>

            <p className="text-[#4C4C4C] font-light max-w-[22rem]">
              Terminá tu perfil para poder publicar servicios y recibir solicitudes.
            </p>
          </div>

          <div className="flex-1" />

          <div className="relative z-10">
            <button
              type="button"
              onClick={() => navigate("/register/provider/detail")}
              className="w-full bg-[#1E2F5D] text-white py-4 rounded-full font-medium shadow-md"
            >
              Continuar
            </button>

            <div className="w-full h-2 bg-[#DDE0E7] rounded-full mt-8">
              <div className="h-2 bg-[#1E2F5D] rounded-full w-[35%]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
