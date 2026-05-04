// Protege las rutas del panel admin.
// Por ahora deja pasar a todos los usuarios (modo visual/desarrollo).
// Cuando el backend esté listo, aquí se verificará el rol del usuario:
// si no está logueado → redirige a /login
// si no es admin → redirige a /home

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: Props) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin)         return <Navigate to="/home"  replace />;

  return <>{children}</>;
}