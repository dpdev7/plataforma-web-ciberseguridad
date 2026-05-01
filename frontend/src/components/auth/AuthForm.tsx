import React, { useState } from 'react';
import {
  Shield,
  LogIn,
  UserPlus,
  KeyRound,
  Mail as MailIcon,
  ArrowLeft,
  ShieldCheck,
  LoaderCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import PasswordStrength from './PasswordStrength';
import Footer from '../common/Footer';
import { validatePassword } from '../../utils/passwordValidator';
import styles from './AuthForm.module.css';

type AuthFormType =
  | 'login'
  | 'register'
  | 'reset-password'
  | 'verify-email'
  | 'reset-password-confirm';

type SubmitResult = {
  keepLoading?: boolean;
  loadingMessage?: string;
  error?: string;
} | void;

interface AuthFormProps {
  type: AuthFormType;
  onSubmit?: (data: Record<string, string>) => Promise<SubmitResult> | SubmitResult;
  onResend?: () => Promise<void> | void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, onResend }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const config = {
    login: {
      title: 'Accede a tu cuenta',
      subtitle: 'Portal de Acceso de Seguridad',
      icon: Shield,
      buttonText: 'Iniciar Sesión',
      loadingText: 'Iniciando sesión...',
      successLoadingText: 'Redirigiendo...',
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
      loadingText: 'Creando cuenta...',
      successLoadingText: 'Procesando registro...',
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
      loadingText: 'Enviando enlace...',
      successLoadingText: 'Procesando...',
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
      loadingText: 'Verificando...',
      successLoadingText: 'Confirmando verificación...',
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
      loadingText: 'Guardando contraseña...',
      successLoadingText: 'Procesando...',
      buttonIcon: ShieldCheck,
      footerText: '¿Recordaste tu contraseña?',
      footerLink: '/login',
      footerLinkText: 'Inicia sesión'
    }
  } as const;

  const currentConfig = config[type];
  const Icon = currentConfig.icon;
  const ButtonIcon = currentConfig.buttonIcon;

  const resetLoadingState = () => {
    setIsLoading(false);
    setLoadingMessage('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setErrorMessage('');

    if (type === 'login') {
      if (!email || !password) {
        setErrorMessage('Por favor completa todos los campos');
        return;
      }
    }

    if (type === 'register') {
      if (!username || !email || !password || !confirmPassword) {
        setErrorMessage('Por favor completa todos los campos');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden');
        return;
      }

      const strength = validatePassword(password);
      if (strength.score < 2) {
        setErrorMessage('La contraseña debe tener al menos fortaleza media');
        return;
      }
    }

    if (type === 'reset-password') {
      if (!email) {
        setErrorMessage('Por favor ingresa tu correo electrónico');
        return;
      }
    }

    if (type === 'verify-email') {
      if (!verificationCode) {
        setErrorMessage('Por favor ingresa el código de verificación');
        return;
      }
    }

    if (type === 'reset-password-confirm') {
      if (!password || !confirmPassword) {
        setErrorMessage('Por favor completa todos los campos');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden');
        return;
      }

      const strength = validatePassword(password);
      if (strength.score < 2) {
        setErrorMessage('La contraseña debe tener al menos fortaleza media');
        return;
      }
    }

    const data: Record<string, string> = {};
    if (email) data.email = email;
    if (password) data.password = password;
    if (username) data.username = username;
    if (verificationCode) data.verificationCode = verificationCode;

    try {
      setLoadingMessage(currentConfig.loadingText);
      setIsLoading(true);

      if (onSubmit) {
        const result = await Promise.resolve(onSubmit(data));

        if (result?.error) {
          setErrorMessage(result.error);
          resetLoadingState();
          return;
        }

        if (result?.loadingMessage) {
          setLoadingMessage(result.loadingMessage);
        } else {
          setLoadingMessage(currentConfig.successLoadingText);
        }

        if (result?.keepLoading) {
          return;
        }

        resetLoadingState();
        return;
      }

      console.log('Datos del formulario:', data);
      await new Promise((resolve) => setTimeout(resolve, 1800));
      resetLoadingState();
      alert('¡Operación exitosa! (modo demo)');
    } catch (error: any) {
      console.error('Error en autenticación:', error);

      const backendMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'Ocurrió un error. Intenta nuevamente.';

      setErrorMessage(backendMessage);
      resetLoadingState();
    }
  };

  const handleResend = async () => {
    if (!onResend || isResending || isLoading) return;

    setErrorMessage('');

    try {
      setIsResending(true);
      await Promise.resolve(onResend());
    } catch (error: any) {
      console.error('Error al reenviar código:', error);

      const backendMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        'No se pudo reenviar el código. Intenta nuevamente.';

      setErrorMessage(backendMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && (
        <div
          className={styles.loadingOverlay}
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className={styles.loadingCard}>
            <LoaderCircle className={styles.loadingSpinner} />
            <h2 className={styles.loadingTitle}>
              {loadingMessage || currentConfig.loadingText}
            </h2>
            <p className={styles.loadingText}>Por favor espera un momento...</p>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate('/')}
          aria-label="Volver al inicio"
          disabled={isLoading}
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

        {errorMessage && (
          <div className={styles.errorBox} role="alert">
            {errorMessage}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          {type === 'register' && (
            <Input
              label="Nombre de usuario"
              type="text"
              placeholder="Elige un nombre de usuario"
              value={username}
              onChange={setUsername}
              iconType="user"
              disabled={isLoading}
            />
          )}

          {(type === 'login' || type === 'register' || type === 'reset-password') && (
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu.correo@ejemplo.com"
              value={email}
              onChange={setEmail}
              iconType="email"
              disabled={isLoading}
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
                onTogglePassword={() => {
                  if (!isLoading) setShowPassword((prev) => !prev);
                }}
                iconType="lock"
                disabled={isLoading}
              />

              {type === 'login' && (
                <div className={styles.forgotContainer}>
                  <a
                    href="/reset-password"
                    className={styles.forgotLink}
                    onClick={(e) => {
                      if (isLoading) e.preventDefault();
                    }}
                  >
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
              onTogglePassword={() => {
                if (!isLoading) setShowConfirmPassword((prev) => !prev);
              }}
              iconType="lock"
              disabled={isLoading}
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
              disabled={isLoading}
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
                onTogglePassword={() => {
                  if (!isLoading) setShowPassword((prev) => !prev);
                }}
                iconType="lock"
                disabled={isLoading}
              />

              <PasswordStrength password={password} />

              <Input
                label="Confirmar nueva contraseña"
                type="password"
                placeholder="Repite tu nueva contraseña"
                value={confirmPassword}
                onChange={setConfirmPassword}
                showPassword={showConfirmPassword}
                onTogglePassword={() => {
                  if (!isLoading) setShowConfirmPassword((prev) => !prev);
                }}
                iconType="lock"
                disabled={isLoading}
              />
            </>
          )}

          <button
            type="submit"
            className={`${styles.button} ${isLoading ? styles.buttonLoading : ''}`}
            disabled={isLoading}
          >
            <span>
              {isLoading
                ? loadingMessage || currentConfig.loadingText
                : currentConfig.buttonText}
            </span>
            {isLoading ? (
              <LoaderCircle className={styles.buttonSpinner} />
            ) : (
              <ButtonIcon className={styles.buttonIcon} />
            )}
          </button>
        </form>

        <p className={styles.footerCard}>
          {currentConfig.footerText}{' '}
          {type === 'verify-email' && onResend ? (
            <button
              type="button"
              className={styles.linkButton}
              onClick={handleResend}
              disabled={isLoading || isResending}
            >
              {isResending ? 'Reenviando...' : currentConfig.footerLinkText}
            </button>
          ) : (
            <a
              href={currentConfig.footerLink}
              className={styles.link}
              onClick={(e) => {
                if (isLoading) e.preventDefault();
              }}
            >
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