import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home                   from './src/pages/Home';
import Amenazas               from './src/pages/Amenazas';
import Herramientas           from './src/pages/Herramientas';
import NotFound               from './src/pages/NotFound';
import Login                  from './src/pages/Login';
import Register               from './src/pages/Register';
import ResetPassword          from './src/pages/ResetPassword';
import ResetPasswordConfirm   from './src/pages/ResetPasswordConfirm';
import VerifyEmail            from './src/pages/VerifyEmail';
import Biblioteca             from './src/pages/Biblioteca';
import ArticuloPage           from './src/pages/ArticuloPage';
import GuiaPage               from './src/pages/GuiaPage';
import CuestionarioPage       from './src/pages/CuestionarioPage';
import ResultadosPage         from './src/pages/ResultadosPage';
import AdminGuard             from './src/components/AdminGuard';
import AdminLayout            from './src/pages/admin/AdminLayout';
import UsersPage              from './src/pages/admin/users/UsersPage';
import ContentPage            from './src/pages/admin/content/ContentPage';
import AdminCuestionariosPage from './src/pages/admin/cuestionarios/CuestionariosPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                                        element={<Navigate to="/home" replace />} />
        <Route path="/home"                                    element={<Home />} />
        <Route path="/amenazas"                               element={<Amenazas />} />
        <Route path="/herramientas"                           element={<Herramientas />} />
        <Route path="/biblioteca"                             element={<Biblioteca />} />
        <Route path="/biblioteca/articulo/:id"                element={<ArticuloPage />} />
        <Route path="/biblioteca/guia/:id"                    element={<GuiaPage />} />
        <Route path="/biblioteca/cuestionario/:id"            element={<CuestionarioPage />} />
        <Route path="/biblioteca/cuestionario/:id/resultados" element={<ResultadosPage />} />
        <Route path="/login"                                  element={<Login />} />
        <Route path="/register"                               element={<Register />} />
        <Route path="/reset-password"                         element={<ResetPassword />} />
        <Route path="/reset-password-confirm"                 element={<ResetPasswordConfirm />} />
        <Route path="/verify-email"                           element={<VerifyEmail />} />
        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route index                element={<UsersPage />} />
          <Route path="users"         element={<UsersPage />} />
          <Route path="content"       element={<ContentPage />} />
          <Route path="cuestionarios" element={<AdminCuestionariosPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;