import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login                from './src/pages/Login';
import Register             from './src/pages/Register';
import ResetPassword        from './src/pages/ResetPassword';
import VerifyEmail          from './src/pages/VerifyEmail';
import Home                 from './src/pages/Home';
import Amenazas             from './src/pages/Amenazas';
import Herramientas         from './src/pages/Herramientas';
import NotFound             from './src/pages/NotFound';
import ResetPasswordConfirm from './src/pages/ResetPasswordConfirm';
import AdminLayout          from './src/pages/admin/AdminLayout';
import UsersPage            from './src/pages/admin/users/UsersPage';
import AdminGuard           from './src/components/AdminGuard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home"                   element={<Home />} />
        <Route path="/amenazas"               element={<Amenazas />} />
        <Route path="/herramientas"           element={<Herramientas />} />
        <Route path="/login"                  element={<Login />} />
        <Route path="/register"               element={<Register />} />
        <Route path="/reset-password"         element={<ResetPassword />} />
        <Route path="/reset-password-confirm" element={<ResetPasswordConfirm />} />
        <Route path="/verify-email"           element={<VerifyEmail />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
          <Route index        element={<UsersPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;