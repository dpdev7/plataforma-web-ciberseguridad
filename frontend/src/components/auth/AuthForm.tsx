import React, { useState } from 'react';
import { Shield, LogIn, UserPlus, KeyRound, Mail as MailIcon, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import PasswordStrength from './PasswordStrength';
import Footer from '../common/Footer';
import { validatePassword } from '../../utils/passwordValidator';
import styles from './AuthForm.module.css';

type AuthFormType = 'login' | 'register' | 'reset-password' | 'verify-email' | 'reset-password-confirm';

interface AuthFormProps {
  type: AuthFormType;
  onSubmit?: (data: Record<string, string>) => void;
  onResend?: () => void;  // ← nuevo
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, onResend }) => {
  const navigate = useNavigate();

  const [email, setEmail]                             = useState('');
  const [password, setPassword]                       = useState('');
  const [showPassword, setShowPassword]               = useState(false);
  const [username, setUsername]                       = useState('');
  const [confirmPassword, setConfirmPassword]         = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode]       = useState('');

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

  const currentConfig = config[type];
  const Icon          = currentConfig.icon;
  const ButtonIcon    = currentConfig.buttonIcon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === 'login') {
      if (!email || !password) {
        alert('Por favor completa todos los campos');
        return;
      }
    }

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

    if (type === 'reset-password') {
      if (!email) {
        alert('Por favor ingresa tu correo electrónico');
        return;
      }
    }

    if (type === 'verify-email') {
      if (!verificationCode) {
        alert('Por favor ingresa el código de verificación');
        return;
      }
    }

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

    const data: Record<string, string> = {};
    if (email)            data.email            = email;
    if (password)         data.password         = password;
    if (username)         data.username         = username;
    if (verificationCode) data.verificationCode = verificationCode;

    if (onSubmit) {
      onSubmit(data);
    } else {
      console.log('Datos del formulario:', data);
      alert('¡Operación exitosa! (modo demo)');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/')}
          aria-label="Volver al inicio"
        >
          <ArrowLeft className={styles.backIcon} />
          <span>Regresar</span>
        </button>

        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Icon className={styles.icon} />
          </div>
          <h1 className={styles.title}>{currentConfig.title}</h1>
          <p className={styles.subtitle}>{currentConfig.subtitle}</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>

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
              {type === 'login' && (
                <div className={styles.forgotContainer}>
                  <a href="/reset-password" className={styles.forgotLink}>
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}
            </div>
          )}

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

          {type === 'register' && <PasswordStrength password={password} />}

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

          <button type="submit" className={styles.button}>
            <span>{currentConfig.buttonText}</span>
            <ButtonIcon className={styles.buttonIcon} />
          </button>

        </form>

        {/* Footer del card — botón de reenvío para verify-email, enlace normal para el resto */}
        <p className={styles.footerCard}>
          {currentConfig.footerText}{' '}
          {type === 'verify-email' && onResend ? (
            <button
              type="button"
              className={styles.link}
              onClick={onResend}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {currentConfig.footerLinkText}
            </button>
          ) : (
            <a href={currentConfig.footerLink} className={styles.link}>
              {currentConfig.footerLinkText}
            </a>
          )}
        </p>

      </div>

      <Footer variant="auth" />
    </div>
  );
};

export default AuthForm;