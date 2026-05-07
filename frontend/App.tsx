import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LazyRoute from './src/routes/LazyRoute';
import { lazyPage } from './src/routes/lazyPage';
import BottomNav    from './src/components/common/BottomNav';
import AdminGuard             from './src/components/AdminGuard';
import {
  preloadAdminContent,
  preloadAdminCuestionarios,
  preloadAdminLayout,
  preloadAdminPublicaciones,
  preloadAdminSolicitudes,
  preloadAdminUsers,
  preloadBiblioteca,
  preloadCuestionario,
  preloadForo,
  preloadGuia,
  preloadHilo,
} from './src/routes/routePreloaders';

const Login = lazyPage(() => import('./src/pages/Login'));
const Register = lazyPage(() => import('./src/pages/Register'));
const ResetPassword = lazyPage(() => import('./src/pages/ResetPassword'));
const ResetPasswordConfirm = lazyPage(() => import('./src/pages/ResetPasswordConfirm'));
const VerifyEmail = lazyPage(() => import('./src/pages/VerifyEmail'));

const Home = lazyPage(() => import('./src/pages/Home'));
const Amenazas = lazyPage(() => import('./src/pages/Amenazas'));
const Herramientas = lazyPage(() => import('./src/pages/Herramientas'));
const Foro = lazyPage(() => import('./src/pages/Foro'));
const Hilo = lazyPage(() => import('./src/pages/Hilo'));
const Biblioteca = lazyPage(() => import('./src/pages/Biblioteca'));
const ArticuloPage = lazyPage(() => import('./src/pages/ArticuloPage'));
const GuiaPage = lazyPage(() => import('./src/pages/GuiaPage'));
const CuestionarioPage = lazyPage(() => import('./src/pages/CuestionarioPage'));
const ResultadosPage = lazyPage(() => import('./src/pages/ResultadosPage'));
const NotFound = lazyPage(() => import('./src/pages/NotFound'));

const AdminLayout = lazyPage(() => import('./src/pages/admin/AdminLayout'));
const UsersPage = lazyPage(() => import('./src/pages/admin/users/UsersPage'));
const ContentPage = lazyPage(() => import('./src/pages/admin/content/ContentPage'));
const AdminCuestionariosPage = lazyPage(() => import('./src/pages/admin/cuestionarios/CuestionariosPage'));
const SolicitudesPage = lazyPage(() => import('./src/pages/admin/solicitudes/SolicitudesPage'));
const PublicacionesPage = lazyPage(() => import('./src/pages/admin/publicaciones/PublicacionesPage'));


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
        <Route path="/home"         element={<LazyRoute component={Home} />} />
        <Route path="/amenazas"     element={<LazyRoute component={Amenazas} />} />
        <Route path="/herramientas" element={<LazyRoute component={Herramientas} />} />
        <Route path="/foro"         element={<LazyRoute component={Foro} preload={preloadForo} />} />
        <Route path="/foro/:id"     element={<LazyRoute component={Hilo} preload={({ params }) => preloadHilo(params.id)} />} />
        <Route path="/biblioteca"                             element={<LazyRoute component={Biblioteca} preload={preloadBiblioteca} />} />
        <Route path="/biblioteca/articulo/:id"                element={<LazyRoute component={ArticuloPage} />} />
        <Route path="/biblioteca/guia/:id"                    element={<LazyRoute component={GuiaPage} preload={({ params }) => preloadGuia(params.id)} />} />
        <Route path="/biblioteca/cuestionario/:id"            element={<LazyRoute component={CuestionarioPage} preload={preloadCuestionario} />} />
        <Route path="/biblioteca/cuestionario/:id/resultados" element={<LazyRoute component={ResultadosPage} />} />


        {/* Auth */}
        <Route path="/login"                  element={<LazyRoute component={Login} />} />
        <Route path="/register"               element={<LazyRoute component={Register} />} />
        <Route path="/reset-password"         element={<LazyRoute component={ResetPassword} />} />
        <Route path="/reset-password-confirm" element={<LazyRoute component={ResetPasswordConfirm} />} />
        <Route path="/verify-email"           element={<LazyRoute component={VerifyEmail} />} />


        {/* Admin — AdminGuard protege el acceso solo a usuarios administradores.
            AdminLayout maneja su propio header móvil con hamburguesa y drawer,
            sin depender del Navbar ni del BottomNav del sitio principal. */}
        <Route path="/admin" element={<AdminGuard><LazyRoute component={AdminLayout} preload={preloadAdminLayout} /></AdminGuard>}>
          <Route index                element={<LazyRoute component={UsersPage} preload={preloadAdminUsers} />} />
          <Route path="users"         element={<LazyRoute component={UsersPage} preload={preloadAdminUsers} />} />
          <Route path="content"       element={<LazyRoute component={ContentPage} preload={preloadAdminContent} />} />
          <Route path="cuestionarios" element={<LazyRoute component={AdminCuestionariosPage} preload={preloadAdminCuestionarios} />} />
          <Route path="solicitudes"   element={<LazyRoute component={SolicitudesPage} preload={preloadAdminSolicitudes} />} />
          <Route path="publicaciones" element={<LazyRoute component={PublicacionesPage} preload={preloadAdminPublicaciones} />} />
        </Route>


        <Route path="*" element={<LazyRoute component={NotFound} />} />
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
