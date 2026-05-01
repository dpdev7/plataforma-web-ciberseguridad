import React, { useId } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  iconType: 'user' | 'email' | 'lock';
  showPassword?: boolean;
  onTogglePassword?: () => void;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  iconType,
  showPassword = false,
  onTogglePassword,
  disabled = false
}) => {
  const inputId = useId();
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  const getIcon = () => {
    switch (iconType) {
      case 'user':
        return <User className={styles.icon} />;
      case 'email':
        return <Mail className={styles.icon} />;
      case 'lock':
        return <Lock className={styles.icon} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
      </label>

      <div className={styles.inputWrapper}>
        {getIcon()}

        <input
          id={inputId}
          className={`${styles.input} ${isPasswordField ? styles.inputWithToggle : ''}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete={
            type === 'email'
              ? 'email'
              : isPasswordField
              ? 'current-password'
              : 'off'
          }
        />

        {isPasswordField && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={onTogglePassword}
            disabled={disabled}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? (
              <EyeOff className={styles.toggleIcon} />
            ) : (
              <Eye className={styles.toggleIcon} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;