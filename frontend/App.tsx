import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './src/pages/Login';
import Register from './src/pages/Register';
import ResetPassword from './src/pages/ResetPassword';
import VerifyEmail from './src/pages/VerifyEmail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;