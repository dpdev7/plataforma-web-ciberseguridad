import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from '../App';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

function Root() {
  const { loading } = useAuth();
  if (loading) return null;
  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <Root />
    </AuthProvider>
  </StrictMode>
);