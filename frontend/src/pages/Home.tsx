import { useState } from 'react';
import '../styles/Home.css';

function Home() {
    const [sidebarAbierto, setSidebarAbierto] = useState(false)
  return (
    <div className="home">

      <nav className="navbar">
        <span className="navbar-logo">CyberGuard</span>
        <div className="navbar-links">
          <a href="#" style={{ color: 'white' }}>Inicio</a>
          <a href="#">Amenazas</a>
          <a href="#">Prevención</a>
          <a href="#">Recursos</a>
          <a href="#">Foro</a>
          <a href="#">Herramientas</a>
          <button className="sidebar-btn" onClick={() => setSidebarAbierto(true)}>
      ☰
          </button>
        </div>
      </nav>

      {/* Fondo oscuro al abrir sidebar */}
      {sidebarAbierto && (
        <div className="sidebar-overlay" onClick={() => setSidebarAbierto(false)} />
    )}

    {/* Sidebar */}
    <div className={`sidebar ${sidebarAbierto ? 'sidebar-visible' : ''}`}>
        <div className="sidebar-header">
            <h3>Recursos a la mano</h3>
            <button className="sidebar-cerrar" onClick={() => setSidebarAbierto(false)}>✕</button>
        </div>

        <div className="sidebar-seccion">
            <p className="sidebar-seccion-titulo">Conceptos Básicos</p>
            <div className="sidebar-item">🔑 <span>Contraseñas Seguras</span></div>
            <div className="sidebar-item">📶 <span>Navegación Segura</span></div>
            <div className="sidebar-item">📱 <span>Protege tu Móvil</span></div>
            <div className="sidebar-item">🪟 <span>Seguridad en tu PC</span></div>
        </div>

        <div className="sidebar-seccion">
            <p className="sidebar-seccion-titulo">Artículos Destacados</p>
            <div className="sidebar-articulo">
             <p className="sidebar-articulo-titulo">Cómo Crear Contraseñas Imposibles de Adivinar</p>
             <p className="sidebar-articulo-tiempo">⏱ 5 min</p>
        </div>
        <div className="sidebar-articulo">
            <p className="sidebar-articulo-titulo">Guía Rápida para Identificar Emails Falsos</p>
            <p className="sidebar-articulo-tiempo">⏱ 3 min</p>
        </div>
        <div className="sidebar-articulo">
            <p className="sidebar-articulo-titulo">Configura el Doble Factor de Autenticación</p>
            <p className="sidebar-articulo-tiempo">⏱ 7 min</p>
        </div>
        <div className="sidebar-articulo">
            <p className="sidebar-articulo-titulo">Cómo Mantener tu Teléfono Libre de Virus</p>
            <p className="sidebar-articulo-tiempo">⏱ 11 min</p>
        </div>
    </div>
</div>

      <section className="hero">
        <h1>Protege tu Mundo Digital</h1>
        <p>Mantente informado y seguro con CyberGuard. Descubre las últimas amenazas, aprende a prevenirlas y accede a herramientas y recursos para una protección completa.</p>
        <button className="btn-primario">Explorar ahora</button>
      </section>

      <section className="seccion">
        <h2>Panorama de Ciberseguridad</h2>
        <p className="seccion-subtitulo">Conceptos clave para entender y empezar tu viaje digital seguro.</p>
        <div className="tarjetas-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="tarjeta">
              <p className="tarjeta-titulo">¿Qué es Ciberseguridad?</p>
              <p className="tarjeta-texto">Es como un escudo digital. Protege tus computadoras, teléfonos y archivos de amenazas en internet.</p>
              <a href="#" className="tarjeta-link">Clave: Protege tu información online →</a>
            </div>
          ))}
        </div>
      </section>

      <section className="seccion">
        <div className="estadisticas-caja">
          <h2>Estadísticas de Ciberseguridad</h2>
          <p className="seccion-subtitulo">Comprende la magnitud de las amenazas cibernéticas.</p>
          <div className="estadisticas-grid">
            {[
              { num: '85%', label: 'Ataques por Phishing', desc: 'Causa principal de las brechas de datos.' },
              { num: '$6M', label: 'Costo promedio de una brecha', desc: 'Para grandes empresas globalmente.' },
              { num: '39%', label: 'Empresas reportan ataques', desc: 'En los últimos 12 meses.' },
              { num: '2200+', label: 'Ataques diarios', desc: 'Promedio a nivel global.' },
            ].map((e, i) => (
              <div key={i}>
                <p className="estadistica-numero">{e.num}</p>
                <p className="estadistica-label">{e.label}</p>
                <p className="estadistica-desc">{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="seccion">
        <h2>Recursos Adicionales</h2>
        <p className="seccion-subtitulo">Todo lo que necesitas para fortalecer tu seguridad.</p>
        <div className="tarjetas-grid">
          {[
            { titulo: 'Recursos Educativos', desc: 'Artículos, guías y tutoriales para todos los niveles.' },
            { titulo: 'Foro de la Comunidad', desc: 'Conecta, pregunta y comparte con otros usuarios.' },
            { titulo: 'Herramientas de Protección', desc: 'Software y plugins recomendados para tu seguridad.' },
          ].map((r, i) => (
            <div key={i} className="tarjeta recurso-tarjeta">
              <p style={{ fontWeight: 'bold', margin: '0 0 8px' }}>{r.titulo}</p>
              <p className="tarjeta-texto">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="seccion">
        <h2>Amenazas digitales más comunes</h2>
        <p className="seccion-subtitulo">Conoce las amenazas cibernéticas más frecuentes y aprende cómo protegerte de ellas.</p>
        <div className="amenazas-grid">

          <div className="amenazas-columna">
            <h3>Tipos de Amenazas</h3>
            {[
              { icon: '🦠', title: 'Malware', desc: 'Software malicioso que puede dañar tu dispositivo, robar datos o tomar control de tu sistema.' },
              { icon: '🎣', title: 'Phishing', desc: 'Correos o sitios web fraudulentos que intentan engañarte para robar tu información.' },
              { icon: '🔒', title: 'Ransomware', desc: 'Software que cifra tus archivos y exige un pago para liberarlos.' },
              { icon: '💥', title: 'Ataques DDoS', desc: 'Inundación de un servidor con tanto tráfico que se cae.' },
              { icon: '🕵️', title: 'Ingeniería Social', desc: 'Manipulación psicológica para hacer que divulgues información confidencial.' },
            ].map((a, i) => (
              <div key={i} className="amenaza-item">
                <span className="amenaza-icono">{a.icon}</span>
                <div>
                  <p className="amenaza-titulo">{a.title}</p>
                  <p className="amenaza-desc">{a.desc}</p>
                </div>
              </div>
            ))}
            <button className="btn-primario">Explora todas las amenazas →</button>
          </div>

          <div className="amenazas-columna">
            <h3>Consejos de Prevención Detallados</h3>
            {[
              { title: 'Actualizaciones constantes', desc: 'Configura actualizaciones automáticas para protegerte de vulnerabilidades conocidas.' },
              { title: 'Contraseñas robustas', desc: 'Usa contraseñas de mínimo 12 caracteres mezclando mayúsculas, minúsculas, números y símbolos.' },
              { title: 'Autenticación de dos factores (2FA)', desc: 'Añade una capa extra de seguridad con un segundo código al momento de acceder.' },
              { title: 'Desconfía de lo inesperado', desc: 'No hagas clic en enlaces ni descargues archivos adjuntos de mensajes inesperados.' },
              { title: 'Uso de VPN en redes públicas', desc: 'Una VPN cifra tu conexión protegiendo tus datos en redes Wi-Fi públicas inseguras.' },
            ].map((c, i) => (
              <div key={i} className="consejo-item">
                <span className="consejo-check">✓</span>
                <div>
                  <p className="consejo-titulo">{c.title}</p>
                  <p className="consejo-desc">{c.desc}</p>
                </div>
              </div>
            ))}
            <button className="btn-primario">Guía completa de prevención →</button>
          </div>

        </div>
      </section>

      <section className="seccion">
        <div className="denuncia-caja">
          <h2>Denunciar un Delito Cibernético</h2>
          <p className="seccion-subtitulo">Si has sido víctima de un delito cibernético, es importante denunciarlo a las autoridades competentes.</p>
          <div className="denuncia-botones">
            <button className="btn-primario">Policía Nacional</button>
            <button className="btn-denuncia-secundario">Guardia Civil</button>
          </div>
        </div>
      </section>

      <footer className="footer">
        © 2024 CyberGuard. Todos los derechos reservados.
      </footer>

    </div>
  );
}

export default Home;