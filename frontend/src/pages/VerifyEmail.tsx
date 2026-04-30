import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";


const VerifyEmail: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Recuperamos los datos del estado de la navegación
  const emailFromState = location.state?.email || "";
  const tipoFromState = location.state?.tipo || "RECUPERACION";

  const handleVerifyEmail = async (data: Record<string, string>) => {
    setLoading(true);
    try {
      const response = await fetch("http://backend-web-ciberseguridad.onrender.com/usuario/verificar/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email || emailFromState,
          codigo: parseInt(data.verificationCode),
          tipo: tipoFromState,
        }),
      });

      if (response.ok) {
        alert("¡Verificación exitosa!");

        // --- LÓGICA DE REDIRECCIÓN SEGÚN EL TIPO ---
        if (tipoFromState === "VERIFICACION") {
          // Si viene del registro, directo al Home
          navigate("/home", { replace: true });
        } else {
          // Si es recuperación, lo ideal es ir a la pantalla de "Nueva Contraseña"
          // Por ahora lo mando a una ruta ejemplo, cámbiala según tu App
          navigate("/reset-password-confirm", {
            state: { email: data.email || emailFromState },
          });
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || "Código incorrecto"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loading ? "opacity-50 pointer-events-none" : ""}>
      <h2 className="text-center text-sm mb-4">
        Verificando para: <span className="font-bold">{tipoFromState}</span>
      </h2>
      <AuthForm type="verify-email" onSubmit={handleVerifyEmail} />
      {loading && (
        <p className="text-center mt-4 animate-pulse">Validando código...</p>
      )}
    </div>
  );
};

export default VerifyEmail;
