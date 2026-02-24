import React from 'react';
import AuthForm from '../components/auth/AuthForm';

const Login: React.FC = () => {
  const handleLogin = (data: Record<string, string>) => {
    console.log('Login data:', data);
    // Aquí irá la lógica de autenticación con el backend
    alert('¡Inicio de sesión exitoso! (modo demo)');
  };

  return <AuthForm type="login" onSubmit={handleLogin} />;
};

export default Login;