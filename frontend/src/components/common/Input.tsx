import React from 'react';
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
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  iconType,
  showPassword,
  onTogglePassword
}) => {
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  const getIcon = () => {
    switch (iconType) {
      case 'user': return <User className={styles.icon} />;
      case 'email': return <Mail className={styles.icon} />;
      case 'lock': return <Lock className={styles.icon} />;
    }
  };

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        {getIcon()}
        <input
          className={`${styles.input} ${isPasswordField ? styles.inputWithToggle : ''}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {isPasswordField && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={onTogglePassword}
          >
            {showPassword ? 
              <EyeOff className={styles.toggleIcon} /> : 
              <Eye className={styles.toggleIcon} />
            }
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;