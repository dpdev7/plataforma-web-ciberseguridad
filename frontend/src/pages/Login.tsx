import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";

type SubmitResult = {
  keepLoading?: boolean;
  loadingMessage?: string;
  error?: string;
};

const Login: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: Record<string, string>): Promise<SubmitResult> => {
    try {
      const response = await fetch("https://backend-web-ciberseguridad.onrender.com/usuario/login/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          keepLoading: false,
          error: result.detail || "Credenciales incorrectas",
        };
      }

      localStorage.setItem("user_name", result.usuario.nombre);

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        navigate("/home", { replace: true });
      }, 2000);

      return {
        keepLoading: true,
        loadingMessage: "Iniciando sesión... Redirigiendo...",
      };
    } catch (error) {
      console.error("Error:", error);
      return {
        keepLoading: false,
        error: "Error de conexión",
      };
    }
  };

  return (
    <div className="min-h-screen relative">
      {showToast && (
        <div className="fixed top-5 right-5 z-[100] animate-bounce">
          <div className="bg-blue-600 text-white px-6 py-4 rounded-xl shadow-2xl border border-blue-400">
            <span className="font-bold">¡Sesión iniciada! Redirigiendo...</span>
          </div>
        </div>
      )}

      <AuthForm type="login" onSubmit={handleLogin} />
    </div>
  );
};

export default Login;