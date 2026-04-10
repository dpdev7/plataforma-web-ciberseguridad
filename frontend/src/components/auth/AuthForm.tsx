// Componente principal de autenticación: login, registro, recuperación y verificación.
import React, { useState } from 'react';
import { Shield, LogIn, UserPlus, KeyRound, Mail as MailIcon, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import PasswordStrength from './PasswordStrength';
import Footer from '../common/Footer';
import { validatePassword } from '../../utils/passwordValidator';
import styles from './AuthForm.module.css';


// Tipos posibles del formulario — cada uno renderiza campos distintos
type AuthFormType = 'login' | 'register' | 'reset-password' | 'verify-email' | 'reset-password-confirm';


interface AuthFormProps {
  type: AuthFormType;
  // onSubmit recibe un objeto con los valores del formulario — la página padre maneja la lógica de red
  onSubmit?: (data: Record<string, string>) => void;
}


const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const navigate = useNavigate();

  // --- Estados de los campos ---
  // Compartidos entre tipos, se usan según el tipo activo
  const [email, setEmail]                             = useState('');
  const [password, setPassword]                       = useState('');
  const [showPassword, setShowPassword]               = useState(false);
  const [username, setUsername]                       = useState('');
  const [confirmPassword, setConfirmPassword]         = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode]       = useState('');


  // --- Configuración por tipo ---
  // Centraliza título, subtítulo, ícono, texto del botón y footer
  // para no duplicar JSX en cada vista
  const config = {
    login: {
      title: 'Accede a tu cuenta',
      subtitle: 'Portal de Acceso de Seguridad',
      icon: Shield,
      buttonText: 'Iniciar Sesión',
      buttonIcon: LogIn,
      footerText: '¿No tienes una cuenta?',
      footerLink: '/register',
      footerLinkText: 'Regístrate ahora'
    },
    register: {
      title: 'Crea tu cuenta',
      subtitle: 'Únete a nuestra comunidad y protege tu mundo digital.',
      icon: Shield,
      buttonText: 'Crear Cuenta',
      buttonIcon: UserPlus,
      footerText: '¿Ya tienes una cuenta?',
      footerLink: '/login',
      footerLinkText: 'Inicia sesión'
    },
    'reset-password': {
      title: 'Recupera tu contraseña',
      subtitle: 'Te enviaremos un enlace para restablecer tu contraseña.',
      icon: KeyRound,
      buttonText: 'Enviar enlace',
      buttonIcon: MailIcon,
      footerText: '¿Recordaste tu contraseña?',
      footerLink: '/login',
      footerLinkText: 'Inicia sesión'
    },
    'verify-email': {
      title: 'Verifica tu correo',
      subtitle: 'Ingresa el código que enviamos a tu correo electrónico.',
      icon: MailIcon,
      buttonText: 'Verificar',
      buttonIcon: MailIcon,
      footerText: '¿No recibiste el código?',
      footerLink: '#',
      footerLinkText: 'Reenviar'
    },
    // Vista final del flujo de recuperación:
    // el usuario ya verificó su identidad y ahora establece su nueva contraseña
    'reset-password-confirm': {
      title: 'Nueva contraseña',
      subtitle: 'Crea una contraseña segura para proteger tu cuenta.',
      icon: KeyRound,
      buttonText: 'Guardar contraseña',
      buttonIcon: ShieldCheck,
      footerText: '¿Recordaste tu contraseña?',
      footerLink: '/login',
      footerLinkText: 'Inicia sesión'
    }
  };


  // Seleccionamos la config del tipo activo para renderizar dinámicamente
  const currentConfig = config[type];
  const Icon          = currentConfig.icon;
  const ButtonIcon    = currentConfig.buttonIcon;


  // Validación y envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación: login requiere email/usuario y contraseña
    if (type === 'login') {
      if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
      }
    }

    // Validación: registro requiere todos los campos, contraseñas iguales y fortaleza mínima media
    if (type === 'register') {
      if (!username || !email || !password || !confirmPassword) {
        alert('Por favor completa todos los campos');
        return;
      }
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      const strength = validatePassword(password);
      if (strength.score < 2) {
        alert('La contraseña debe tener al menos fortaleza media');
        return;
      }
    }

    // Validación: recuperación solo requiere el email
    if (type === 'reset-password') {
      if (!email) {
        alert('Por favor ingresa tu correo electrónico');
        return;
      }
    }

    // Validación: verificación requiere el código de 6 dígitos
    if (type === 'verify-email') {
      if (!verificationCode) {
        alert('Por favor ingresa el código de verificación');
        return;
      }
    }

    // Validación: nueva contraseña requiere ambos campos, que coincidan y fortaleza mínima — igual que en registro
    if (type === 'reset-password-confirm') {
      if (!password || !confirmPassword) {
        alert('Por favor completa todos los campos');
        return;
      }
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
      const strength = validatePassword(password);
      if (strength.score < 2) {
        alert('La contraseña debe tener al menos fortaleza media');
        return;
      }
    }

    // Construimos el objeto de datos con solo los campos que tienen valor
    // La página padre (Login, Register, etc.) recibe este objeto y hace el fetch
    const data: Record<string, string> = {};
    if (email)            data.email            = email;
    if (password)         data.password         = password;
    if (username)         data.username         = username;
    if (verificationCode) data.verificationCode = verificationCode;

    if (onSubmit) {
      onSubmit(data);
    } else {
      // Fallback demo: útil para probar el componente sin página padre
      console.log('Datos del formulario:', data);
      alert('¡Operación exitosa! (modo demo)');
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.card}>

        {/* Botón de regreso — navega al home en todas las vistas */}
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/')}
          aria-label="Volver al inicio"
        >
          <ArrowLeft className={styles.backIcon} />
          <span>Regresar</span>
        </button>

        {/* Header dinámico — ícono, título y subtítulo según el tipo */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Icon className={styles.icon} />
          </div>
          <h1 className={styles.title}>{currentConfig.title}</h1>
          <p className={styles.subtitle}>{currentConfig.subtitle}</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>

          {/* Campo: nombre de usuario — solo en registro */}
          {type === 'register' && (
            <Input
              label="Nombre de usuario"
              type="text"
              placeholder="Elige un nombre de usuario"
              value={username}
              onChange={setUsername}
              iconType="user"
            />
          )}

          {/* Campo: email — en login, registro y solicitud de recuperación */}
          {(type === 'login' || type === 'register' || type === 'reset-password') && (
            <Input
              label={type === 'login' ? 'Correo electrónico o usuario' : 'Correo electrónico'}
              type={type === 'login' ? 'text' : 'email'}
              placeholder="tu.correo@ejemplo.com"
              value={email}
              onChange={setEmail}
              iconType={type === 'login' ? 'user' : 'email'}
            />
          )}

          {/* Campo: contraseña — solo en login y registro */}
          {(type === 'login' || type === 'register') && (
            <div>
              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                iconType="lock"
              />
              {/* Enlace "¿Olvidaste tu contraseña?" — solo visible en login */}
              {type === 'login' && (
                <div className={styles.forgotContainer}>
                  <a href="/reset-password" className={styles.forgotLink}>
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Campo: confirmar contraseña — solo en registro */}
          {type === 'register' && (
            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={setConfirmPassword}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
              iconType="lock"
            />
          )}

          {/* Indicador de fortaleza de contraseña — solo en registro */}
          {type === 'register' && <PasswordStrength password={password} />}

          {/* Campo: código de verificación — solo en verify-email */}
          {type === 'verify-email' && (
            <Input
              label="Código de verificación"
              type="text"
              placeholder="000000"
              value={verificationCode}
              onChange={setVerificationCode}
              iconType="email"
            />
          )}

          {/* Campos exclusivos de la vista "nueva contraseña":
              nueva contraseña + indicador de fortaleza + confirmación */}
          {type === 'reset-password-confirm' && (
            <>
              <Input
                label="Nueva contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                iconType="lock"
              />
              {/* Mismo componente de fortaleza que en registro */}
              <PasswordStrength password={password} />
              <Input
                label="Confirmar nueva contraseña"
                type="password"
                placeholder="Repite tu nueva contraseña"
                value={confirmPassword}
                onChange={setConfirmPassword}
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                iconType="lock"
              />
            </>
          )}

          {/* Botón submit — texto e ícono dinámicos según el tipo */}
          <button type="submit" className={styles.button}>
            <span>{currentConfig.buttonText}</span>
            <ButtonIcon className={styles.buttonIcon} />
          </button>

        </form>

        {/* Footer del card — enlace dinámico según el tipo */}
        <p className={styles.footerCard}>
          {currentConfig.footerText}{' '}
          <a href={currentConfig.footerLink} className={styles.link}>
            {currentConfig.footerLinkText}
          </a>
        </p>

      </div>

      {/* Footer global — posicionado al fondo con position: fixed */}
      <Footer variant="auth" />
    </div>
  );
};

export default AuthForm;