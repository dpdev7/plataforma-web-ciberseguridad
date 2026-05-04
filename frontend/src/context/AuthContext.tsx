import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { setAuthToken } from '../utils/api';

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  es_administrador: boolean;
}

interface AuthContextType {
  token: string | null;
  usuario: Usuario | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token,   setToken]   = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const u = localStorage.getItem('auth_usuario');
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setAuthToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = useCallback((token: string, usuario: Usuario) => {
    setToken(token);
    setUsuario(usuario);
    setAuthToken(token);
    localStorage.setItem('auth_usuario', JSON.stringify(usuario));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUsuario(null);
    setAuthToken(null);
    localStorage.removeItem('auth_usuario');
  }, []);

  return (
    <AuthContext.Provider value={{
      token,
      usuario,
      login,
      logout,
      isAuthenticated: !!token,
      isAdmin: !!usuario?.es_administrador,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}