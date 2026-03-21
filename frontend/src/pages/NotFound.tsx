// Página 404 - No encontrada, muestra un mensaje y opciones para volver al inicio o a la página anterior
import { useNavigate } from 'react-router-dom';
import { ShieldOff } from 'lucide-react';
import Footer from '../components/common/Footer';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      {/* Contenido principal centrado */}
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <ShieldOff className={styles.icon} />
        </div>

        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Página no encontrada</h1>
        <p className={styles.description}>
          La ruta que buscas no existe o fue movida.
          <br />
          Verifica la URL o regresa al inicio.
        </p>

        <div className={styles.actions}>
          <button className={styles.btnPrimario} onClick={() => navigate('/')}>
            Volver al inicio
          </button>
          <button
            className={styles.btnSecundario}
            onClick={() => navigate(-1)}
          >
            Página anterior
          </button>
        </div>
      </div>

      {/* Footer: se queda abajo */}
      <Footer variant="auth" />
    </div>
  );
}
