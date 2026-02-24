import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const VerifyEmail: React.FC = () => {
  const handleVerifyEmail = (data: Record<string, string>) => {
    console.log('Verification code:', data);
    alert('¡Email verificado exitosamente! (modo demo)');
  };

  return <AuthForm type="verify-email" onSubmit={handleVerifyEmail} />;
};

export default VerifyEmail;