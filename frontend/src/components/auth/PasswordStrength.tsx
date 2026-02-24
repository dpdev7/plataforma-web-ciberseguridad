import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, XCircle, Circle } from 'lucide-react';
import { validatePassword, getPasswordRequirements } from '../../utils/passwordValidator';
import styles from './PasswordStrength.module.css';

interface PasswordStrengthProps {
  password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  if (!password) return null;

  const strength = validatePassword(password);
  const requirements = getPasswordRequirements(password);

  // Función que decide qué ícono y qué clase CSS aplicar según el estado de la regla
  const getRequirementProps = (req: { met: boolean; hasError?: boolean }) => {
    if (req.hasError) {
      return { Icon: XCircle, className: styles.requirementError };
    }
    if (req.met) {
      return { Icon: CheckCircle2, className: styles.requirementMet };
    }
    return { Icon: Circle, className: styles.requirementNotMet };
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.labelWrapper}>
          <span className={styles.label}>Fortaleza</span>
          <button
            type="button"
            className={styles.infoButton}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <AlertCircle className={styles.infoIcon} />
            
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
        <span className={styles.strengthLabel} style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>
      
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
