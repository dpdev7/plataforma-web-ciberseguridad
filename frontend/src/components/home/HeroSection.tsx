// Banner principal del Home con imagen de fondo
// Overlay de blur y degradados laterales para integración visual con el fondo oscuro de la página.

import imgHeroBg from '../../assets/images/cyberbanner.webp';

export default function HeroSection() {
  return (
    // scroll-margin-top definido en CSS para que el TOC haga scroll correctamente considerando la navbar fija
    <section
      id="introduccion"
      className="hero"
      style={{ backgroundImage: `url(${imgHeroBg})` }}
    >
      {/* Capa de blur sobre la imagen de fondo */}
      <div className="hero-overlay" />

      {/* Contenido centrado sobre el overlay */}
      <div className="hero-content">
        <h1>
          Lorem ipsum dolor sit amet.<br />
          <span>Lorem, ipsum dolor.</span>
        </h1>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit dolorem
          perferendis ea adipisci! Vitae expedita ad culpa nemo. Lorem ipsum dolor
          sit amet consectetur.
        </p>
      </div>

      {/* hero::after en CSS aplica degradados en los 4 bordes
          para que la imagen se fusione con --bg-base */}
    </section>
  );
}
