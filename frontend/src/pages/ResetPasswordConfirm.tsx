import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "../components/auth/AuthForm";


// Página final del flujo de recuperación de contraseña.
// Flujo completo:
//   /reset-password        → usuario ingresa su email
//   /verify-email          → usuario verifica el código (tipo: "RECUPERACION")
//   /reset-password-confirm → esta página — usuario establece su nueva contraseña
const ResetPasswordConfirm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // El email llega desde VerifyEmail.tsx vía navigate('/reset-password-confirm', { state: { email } })
  // Se necesita para enviarlo al backend junto con la nueva contraseña
  const emailFromState = location.state?.email || "";

  const handleResetConfirm = async (data: Record<string, string>) => {
    setLoading(true);
    try {
      // Enviamos el email recuperado del state y la nueva contraseña al backend
      const response = await fetch(
        "http://backend-web-ciberseguridad.onrender.com/usuario/cambiar-password/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailFromState,
            password: data.password, // AuthForm ya valida que coincida con confirmPassword
          }),
        },
      );

      if (response.ok) {
        alert("¡Contraseña actualizada correctamente!");
        // Redirigimos al login — flujo completado
        navigate("/login", { replace: true });
      } else {
        const errorData = await response.json();
        alert(
          `Error: ${errorData.detail || "No se pudo actualizar la contraseña"}`,
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Mientras carga, bloqueamos interacción y reducimos opacidad
    // igual que en Login.tsx y Register.tsx
    <div className={loading ? "opacity-40 pointer-events-none" : ""}>
      {/* AuthForm maneja todo el UI — esta página solo gestiona la lógica de red */}
      <AuthForm type="reset-password-confirm" onSubmit={handleResetConfirm} />
    </div>
  );
};

export default ResetPasswordConfirm;
