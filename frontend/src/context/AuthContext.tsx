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
  const [token,   setToken]   = useState<string | null>(null);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true); // ← evita flash de "no autenticado"

  // Al cargar la app, intenta renovar el access token con la cookie
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/token/refresh/`, {
          method:      'POST',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          // También necesitamos el usuario — llamamos /me/
          const me = await fetch(`${import.meta.env.VITE_API_URL_BACKEND}/usuario/me/`, {
            headers: { Authorization: `Bearer ${data.token}` },
          });
          if (me.ok) {
            const meData = await me.json();
            setToken(data.token);
            setUsuario(meData.usuario);
            setAuthToken(data.token);
          }
        }
      } catch {
        // Sin sesión activa, no pasa nada
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const login = useCallback((token: string, usuario: Usuario) => {
    setToken(token);
    setUsuario(usuario);
    setAuthToken(token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUsuario(null);
    setAuthToken(null);
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