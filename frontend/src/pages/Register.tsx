import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const Register: React.FC = () => {
  const handleRegister = (data: Record<string, string>) => {
    console.log('Register data:', data);
    // Aquí irá la lógica de registro con el backend
    alert('¡Cuenta creada exitosamente! (modo demo)');
  };

  return <AuthForm type="register" onSubmit={handleRegister} />;
};

export default Register;