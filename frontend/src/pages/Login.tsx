import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";


const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: Record<string, string>) => {
    setLoading(true);

    try {
      const response = await fetch("http://backend-web-ciberseguridad.onrender.com/usuario/login/", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // El backend lo envía como cookie HttpOnly automáticamente

        // Opcional: guardar datos NO sensibles
        localStorage.setItem("user_name", result.usuario.nombre);

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate("/home", { replace: true });
        }, 2000);
      } else {
        alert(`Error: ${result.detail || "Credenciales incorrectas"}`);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
      setLoading(false);
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

      <div className={loading ? "opacity-40 pointer-events-none" : ""}>
        <AuthForm type="login" onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
