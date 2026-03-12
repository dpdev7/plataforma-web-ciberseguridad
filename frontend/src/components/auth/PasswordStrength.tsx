// Componente visual para mostrar la fortaleza de la contraseña.
import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { validatePassword, getPasswordRequirements } from '../../utils/passwordValidator';
import styles from './PasswordStrength.module.css';

// Recibe la contraseña a evaluar como prop.
interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  // Estado para mostrar/ocultar el tooltip de requisitos.
  const [showTooltip, setShowTooltip] = useState(false);

  // Si no hay contraseña, no se muestra el componente.
  if (!password) return null;

  // Calcula la fortaleza y requisitos de la contraseña usando utilidades.
  const strength = validatePassword(password);
  const requirements = getPasswordRequirements(password);

  // Determina el ícono y la clase CSS para cada requisito.
  // Esto permite feedback visual sobre qué reglas se cumplen.
  const getRequirementProps = (req: { met: boolean; hasError?: boolean }) => {
    if (req.hasError) {
      return { Icon: XCircle, className: styles.requirementError };
    }
    if (req.met) {
      return { Icon: CheckCircle2, className: styles.requirementMet };
    }
    return { Icon: Circle, className: styles.requirementNotMet };
  };

  // Renderiza el indicador de fortaleza y los requisitos.
  // El usuario recibe feedback visual y educativo para mejorar su contraseña.
  return (
    <div className={styles.container}>
      {/* Header: muestra la etiqueta y el botón de información */}
      <div className={styles.header}>
        <div className={styles.labelWrapper}>
          <span className={styles.label}>Fortaleza</span>
          {/* Botón para mostrar los requisitos de contraseña segura */}
          <button
            type="button"
            className={styles.infoButton}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <AlertCircle className={styles.infoIcon} />
            {/* Tooltip con requisitos, ayuda a educar al usuario sobre buenas prácticas */}
            {showTooltip && (
              <div className={styles.tooltip}>
                <p className={styles.tooltipTitle}>
                  Requisitos de contraseña segura:
                </p>
                <ul className={styles.requirementsList}>
                  {requirements.map((req, index) => {
                    // Evaluamos la regla actual
                    const { Icon, className } = getRequirementProps(req);
                    return (
                      <li key={index} className={`${styles.requirement} ${className}`}>
                        <span className={styles.requirementIcon}>
                          <Icon size={16} />
                        </span>
                        <span>{req.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </button>
        </div>
        {/* Etiqueta visual de fortaleza, cambia color según el resultado */}
        <span className={styles.strengthLabel} style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>
      {/* Barra visual de fortaleza, ayuda a entender el nivel de seguridad */}
      <div className={styles.barContainer}>
        <div 
          className={styles.bar}
          style={{ 
            width: `${strength.percentage}%`,
            backgroundColor: strength.color 
          }}
        />
      </div>
    </div>
  );
};

export default PasswordStrength;
