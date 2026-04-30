import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importante para la redirección
import AuthForm from "../components/auth/AuthForm";


const ResetPassword: React.FC = () => {
  const [, /*loading*/ setLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (data: Record<string, string>) => {
    setLoading(false);
    try {
      const response = await fetch(
        "http://backend-web-ciberseguridad.onrender.com/usuario/solicitar-codigo/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            tipo: "RECUPERACION",
          }),
        },
      );

      if (response.ok) {
        // Redirigimos y pasamos el email en el estado de la ruta
        navigate("/verify-email", { state: { email: data.email } });
      } else {
        alert("Error al enviar el código. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return <AuthForm type="reset-password" onSubmit={handleResetPassword} />;
};

export default ResetPassword;
