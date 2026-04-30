import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";


const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: Record<string, string>) => {
    setLoading(true);

    const payload = {
      nombre: data.username,
      email: data.email,
      password: data.password,
    };

    try {
      const response = await fetch("https://backend-web-ciberseguridad.onrender.com/usuario/registro/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setShowToast(true);

        setTimeout(() => {
          setShowToast(false);
          // Redirigimos a la verificación pasando el email y el tipo nuevo
          navigate("/verify-email", {
            state: {
              email: data.email,
              tipo: "VERIFICACION",
            },
            replace: true,
          });
        }, 2000);
      } else {
        alert(`Error: ${result.detail || "Datos inválidos"}`);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión con el servidor");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {showToast && (
        <div className="fixed top-5 right-5 z-[100] transform transition-all duration-500 ease-in-out">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400">
            <div className="bg-white/20 rounded-full p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm">¡Registro exitoso!</p>
              <p className="text-xs opacity-90">
                Por favor, verifica tu código enviado al correo...
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className={
          loading
            ? "opacity-40 pointer-events-none transition-opacity"
            : "transition-opacity"
        }
      >
        <AuthForm type="register" onSubmit={handleRegister} />
        {loading && !showToast && (
          <div className="flex flex-col items-center mt-6 gap-2">
            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-600 text-sm font-semibold tracking-wide">
              PROCESANDO REGISTRO...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
