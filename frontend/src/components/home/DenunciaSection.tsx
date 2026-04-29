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
          Si has sido víctima de un delito cibernético en Barranquilla o Colombia,
          puedes reportarlo a las autoridades competentes a través de los siguientes
          canales oficiales. Actuar rápido aumenta las posibilidades de recuperar
          tu información y detener a los responsables.
        </p>
        <div className="denuncia-botones">
          <a
            href="https://caivirtual.policia.gov.co"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primario"
          >
            CAI Virtual - Policía Nacional
          </a>
          <a
            href="https://adenunciar.policia.gov.co/Adenunciar/Login.aspx?ReturnUrl=%2fAdenunciar%2fdefault.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-denuncia-secundario"
          >
            Fiscalía General - Denuncia en Línea
          </a>
        </div>
      </div>
    </section>
  );
}
