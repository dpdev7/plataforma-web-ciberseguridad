import React, { useState } from 'react';
import { Shield, LogIn, UserPlus, KeyRound, Mail as MailIcon } from 'lucide-react';
import Input from '../common/Input';
import PasswordStrength from './PasswordStrength';
import { validatePassword } from '../../utils/passwordValidator';
import styles from './AuthForm.module.css';

type AuthFormType = 'login' | 'register' | 'reset-password' | 'verify-email';

interface AuthFormProps {
  type: AuthFormType;
  onSubmit?: (data: Record<string, string>) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  // Estados comunes
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados específicos de registro
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estado para verificación de email
  const [verificationCode, setVerificationCode] = useState('');

  // Configuración según el tipo
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
    }
  };

  const currentConfig = config[type];
  const Icon = currentConfig.icon;
  const ButtonIcon = currentConfig.buttonIcon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones según el tipo
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

    // Ejecutar callback personalizado si existe
    const data: Record<string, string> = {};
    if (email) data.email = email;
    if (password) data.password = password;
    if (username) data.username = username;
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
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <Icon className={styles.icon} />
          </div>
          <h1 className={styles.title}>{currentConfig.title}</h1>
          <p className={styles.subtitle}>{currentConfig.subtitle}</p>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Username (solo en registro) */}
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

          {/* Email (login, register, reset-password) */}
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

          {/* Password (login, register) */}
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

          {/* Confirm Password (solo en registro) */}
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

          {/* Password Strength (solo en registro) */}
          {type === 'register' && <PasswordStrength password={password} />}

          {/* Verification Code (solo en verify-email) */}
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

          {/* Submit Button */}
          <button type="submit" className={styles.button}>
            <span>{currentConfig.buttonText}</span>
            <ButtonIcon className={styles.buttonIcon} />
          </button>
        </form>

        {/* Footer */}
        <p className={styles.footer}>
          {currentConfig.footerText}{' '}
          <a href={currentConfig.footerLink} className={styles.link}>
            {currentConfig.footerLinkText}
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;