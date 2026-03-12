// Footer autónomo con soporte para dos variantes visuales:
//   - "page" (default): flujo normal del documento, textos en extremos — para Home.
//   - "auth": fixed al fondo de pantalla, centrado — para Login, Register, etc.
//   El componente se posiciona solo según la variante, sin CSS adicional en la página padre.
import styles from './Footer.module.css';

interface FooterProps {
  variant?: 'page' | 'auth';
}

export default function Footer({ variant = 'page' }: FooterProps) {
  return (
    <footer className={`${styles.footer} ${variant === 'auth' ? styles.footerAuth : ''}`}>
      <span>© 2025 CyberGuard. Todos los derechos reservados.</span>
      <span>Protege tu mundo digital</span>
    </footer>
  );
}
