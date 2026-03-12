// Sección informativa para reportar delitos cibernéticos.
// Los enlaces apuntan a organismos oficiales externos
// Usar target="_blank" con rel="noopener noreferrer" por seguridad (evita tabnapping).

export default function DenunciaSection() {
  return (
    <section id="denuncia" className="doc-section">
      <p className="doc-section-label">Soporte</p>
      <h2>Cómo Denunciar</h2>

      <div className="denuncia-caja">
        <h2>Denunciar un Delito Cibernético</h2>
        <p>
          Si has sido víctima de un delito cibernético, es importante denunciarlo a las
          autoridades competentes. Puedes encontrar información y recursos en los
          siguientes enlaces:
        </p>
        <div className="denuncia-botones">
          {/* Enlaces externos con noopener noreferrer para prevenir tabnapping */}
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primario"
          >
            Canal denuncia 1
          </a>
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="btn-denuncia-secundario"
          >
            Canal denuncia 2
          </a>
        </div>
      </div>
    </section>
  );
}
