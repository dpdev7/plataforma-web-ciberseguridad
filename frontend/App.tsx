import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login         from './src/pages/Login';
import Register      from './src/pages/Register';
import ResetPassword from './src/pages/ResetPassword';
import VerifyEmail   from './src/pages/VerifyEmail';
import Home          from './src/pages/Home';
import Amenazas      from './src/pages/Amenazas';
import Herramientas from './src/pages/Herramientas';
import NotFound      from './src/pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/amenazas" element={<Amenazas />} />
        <Route path="/herramientas" element={<Herramientas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/home" element={<Home />} />

        {/* Captura cualquier ruta no definida */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
