// Página principal de CyberGuard.
// Responsabilidades de este archivo:
//   1. Rastrear qué sección está visible (activeSection)
//   2. Configurar el IntersectionObserver para el TOC
//   3. Componer todos los sub-componentes en orden
//
// Todo el contenido visual vive en components/home/.
// Todos los datos estáticos viven en constants/homeData.tsx.
// Estado menuOpen para controlar el drawer mobile del TocSidebar.

import { useState, useEffect } from 'react';
import '../styles/Home.css';
import { TOC_ITEMS } from '../constants/homeData';

import Navbar              from '../components/common/Navbar';
import Footer              from '../components/common/Footer';
import TocSidebar          from '../components/home/TocSidebar';
import HeroSection         from '../components/home/HeroSection';
import FundamentosSection  from '../components/home/FundamentosSection';
import EstadisticasSection from '../components/home/EstadisticasSection';
import AmenazasSection     from '../components/home/AmenazasSection';
import RecursosSection     from '../components/home/RecursosSection';
import DenunciaSection     from '../components/home/DenunciaSection';

function Home() {
  const [activeSection, setActiveSection] = useState('introduccion');
  const [menuOpen, setMenuOpen] = useState(false); // Estado del drawer mobile

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Bloquea el scroll del body cuando el drawer está abierto en mobile
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home">
      <Navbar
        onMenuToggle={() => setMenuOpen(prev => !prev)}
        menuOpen={menuOpen}
      />

      <div className="doc-layout">
        <TocSidebar
          activeSection={activeSection}
          onScrollTo={scrollTo}
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
        <main className="doc-content">
          <HeroSection />
          <FundamentosSection />
          <EstadisticasSection />
          <AmenazasSection />
          <RecursosSection />
          <DenunciaSection />
        </main>
      </div>

      {/* Wrapper exclusivo de Home: empuja el footer a la derecha
          del sidebar TOC. En otras páginas (AuthForm, etc.) el Footer
          se usa directamente sin este wrapper. */}
      <div className="home-footer-wrapper">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
