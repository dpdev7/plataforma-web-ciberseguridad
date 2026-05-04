import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';


// Auth
import Login                from './src/pages/Login';
import Register             from './src/pages/Register';
import ResetPassword        from './src/pages/ResetPassword';
import ResetPasswordConfirm from './src/pages/ResetPasswordConfirm';
import VerifyEmail          from './src/pages/VerifyEmail';


// Main
import Home         from './src/pages/Home';
import Amenazas     from './src/pages/Amenazas';
import Herramientas from './src/pages/Herramientas';
import Foro         from './src/pages/Foro';
import Hilo         from './src/pages/Hilo';
import BottomNav    from './src/components/common/BottomNav';
import Biblioteca       from './src/pages/Biblioteca';
import ArticuloPage     from './src/pages/ArticuloPage';
import GuiaPage         from './src/pages/GuiaPage';
import CuestionarioPage from './src/pages/CuestionarioPage';
import ResultadosPage   from './src/pages/ResultadosPage';


// Admin
import AdminGuard             from './src/components/AdminGuard';
import AdminLayout            from './src/pages/admin/AdminLayout';
import UsersPage              from './src/pages/admin/users/UsersPage';
import ContentPage            from './src/pages/admin/content/ContentPage';
import AdminCuestionariosPage from './src/pages/admin/cuestionarios/CuestionariosPage';
import SolicitudesPage from './src/pages/admin/solicitudes/SolicitudesPage';


import NotFound from './src/pages/NotFound';


// AppContent vive dentro de BrowserRouter para poder usar useLocation.
// Esto es necesario porque useLocation requiere estar dentro del contexto
// del router — no puede usarse al mismo nivel que <BrowserRouter>.
function AppContent() {
  const location = useLocation();

  // Detecta cualquier subruta del panel admin (/admin, /admin/users, etc.)
  // para ocultar el BottomNav que es exclusivo del sitio principal.
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />


        {/* Main */}
        <Route path="/home"         element={<Home />} />
        <Route path="/amenazas"     element={<Amenazas />} />
        <Route path="/herramientas" element={<Herramientas />} />
        <Route path="/foro"         element={<Foro />} />
        <Route path="/foro/:id"     element={<Hilo />} />
        <Route path="/biblioteca"                             element={<Biblioteca />} />
        <Route path="/biblioteca/articulo/:id"                element={<ArticuloPage />} />
        <Route path="/biblioteca/guia/:id"                    element={<GuiaPage />} />
        <Route path="/biblioteca/cuestionario/:id"            element={<CuestionarioPage />} />
        <Route path="/biblioteca/cuestionario/:id/resultados" element={<ResultadosPage />} />


        {/* Auth */}
        <Route path="/login"                  element={<Login />} />
        <Route path="/register"               element={<Register />} />
        <Route path="/reset-password"         element={<ResetPassword />} />
        <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
        <Route path="/verify-email"           element={<VerifyEmail />} />


        {/* Admin — AdminGuard protege el acceso solo a usuarios administradores.
            AdminLayout maneja su propio header móvil con hamburguesa y drawer,
            sin depender del Navbar ni del BottomNav del sitio principal. */}
        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route index                element={<UsersPage />} />
          <Route path="users"         element={<UsersPage />} />
          <Route path="content"       element={<ContentPage />} />
          <Route path="cuestionarios" element={<AdminCuestionariosPage />} />
          <Route path="solicitudes"   element={<SolicitudesPage />} />
        </Route>


        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* BottomNav solo se renderiza en rutas del sitio principal.
          En /admin y sus subrutas permanece oculto para no interferir
          con el layout propio del panel de administración. */}
      {!isAdminRoute && <BottomNav />}
    </>
  );
}


function App() {
  return (
    // BrowserRouter debe envolver AppContent (no al revés) para que
    // useLocation funcione correctamente dentro de AppContent.
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}


export default App;