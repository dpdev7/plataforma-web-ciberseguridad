import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const ResetPassword: React.FC = () => {
  const handleResetPassword = (data: Record<string, string>) => {
    console.log('Reset password data:', data);
    alert('¡Enlace enviado! Revisa tu correo electrónico. (modo demo)');
  };

  return <AuthForm type="reset-password" onSubmit={handleResetPassword} />;
};

export default ResetPassword;