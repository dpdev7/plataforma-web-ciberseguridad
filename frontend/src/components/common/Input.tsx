// Componente reutilizable para campos de formulario.
// Permite mostrar íconos, alternar visibilidad de contraseña y personalizar el campo.
import React from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

// Props del componente: permiten adaptar el campo a distintos usos (usuario, email, contraseña).
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
  // Determina si el campo es de tipo contraseña.
  const isPasswordField = type === 'password';
  // Permite alternar entre mostrar y ocultar la contraseña.
  const inputType = isPasswordField && showPassword ? 'text' : type;

  // Devuelve el ícono correspondiente según el tipo de campo.
  const getIcon = () => {
    switch (iconType) {
      case 'user': return <User className={styles.icon} />;
      case 'email': return <Mail className={styles.icon} />;
      case 'lock': return <Lock className={styles.icon} />;
    }
  };

  // Renderiza el campo de entrada con ícono y, si es contraseña, botón para alternar visibilidad.
  // La estructura modular permite usar el mismo componente en login, registro y recuperación.
  return (
    <div className={styles.field}>
      {/* Etiqueta del campo, importante para accesibilidad */}
      <label className={styles.label}>{label}</label>
      <div className={styles.inputWrapper}>
        {/* Ícono visual según el tipo de campo */}
        {getIcon()}
        <input
          className={`${styles.input} ${isPasswordField ? styles.inputWithToggle : ''}`}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {/* Botón para alternar visibilidad de contraseña, solo si es campo password */}
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

// Exporta el componente para su uso en formularios de autenticación y registro.
export default Input;