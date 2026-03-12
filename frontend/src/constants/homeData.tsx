// Datos estáticos del Home

import { Bug, Lock, Zap, UserRound } from 'lucide-react';

// Items del índice lateral (TOC). Cada id debe coincidir exactamente con el id de la <section> correspondiente.
export const TOC_ITEMS = [
  { id: 'introduccion', icon: 'home',      label: 'Introducción' },
  { id: 'conceptos',    icon: 'menu_book', label: 'Fundamentos' },
  { id: 'estadisticas', icon: 'bar_chart', label: 'Estadísticas' },
  { id: 'amenazas',     icon: 'gpp_maybe', label: 'Amenazas' },
  { id: 'recursos',     icon: 'build',     label: 'Recursos' },
  { id: 'denuncia',     icon: 'report',    label: 'Cómo Denunciar' },
];

// Artículos mostrados en la parte inferior del sidebar
export const ARTICULOS = [
  { titulo: 'Cómo Crear Contraseñas Imposibles de Adivinar', tiempo: '5 min' },
  { titulo: 'Guía Rápida para Identificar Emails Falsos',    tiempo: '3 min' },
  { titulo: 'Configura el Doble Factor de Autenticación',    tiempo: '7 min' },
  { titulo: 'Cómo Mantener tu Teléfono Libre de Virus',      tiempo: '11 min' },
];

// Cifras destacadas de la sección Estadísticas
export const ESTADISTICAS = [
  { num: '2,200+', label: 'Ataques Diarios', desc: 'Ciberataques registrados cada día a nivel global' },
  { num: '$4.5M',  label: 'Costo Promedio',  desc: 'Pérdidas promedio por brecha de seguridad' },
  { num: '95%',    label: 'Error Humano',    desc: 'De los incidentes son causados por personas' },
  { num: '300B',   label: 'Contraseñas',     desc: 'Contraseñas en uso a nivel mundial' },
];

// Tarjetas de recursos con enlace a páginas internas
export const RECURSOS = [
  {
    icon:   'shield',
    titulo: 'Herramientas de Seguridad',
    desc:   'Descubre las mejores herramientas para proteger tus dispositivos, redes y datos personales contra amenazas digitales.',
    href:   '/herramientas',
    label:  'Ver herramientas →',
  },
  {
    icon:   'local_library',
    titulo: 'Biblioteca de Ciberseguridad',
    desc:   'Accede a guías, artículos y recursos educativos para aprender a tu propio ritmo sobre seguridad digital.',
    href:   '/biblioteca',
    label:  'Ir a la biblioteca →',
  },
  {
    icon:   'forum',
    titulo: 'Foro de Ciberseguridad',
    desc:   'Conecta con la comunidad, comparte experiencias y resuelve dudas sobre protección digital con otros usuarios.',
    href:   '/foro',
    label:  'Unirse al foro →',
  },
];

// Lista de amenazas. Usa íconos SVG de Lucide (no Material Symbols) porque se renderizan dentro de tarjetas con fondo flex, no como font-icon.
export const AMENAZAS = [
  { icon: <Bug size={20} />,       title: 'Malware',           desc: 'Software malicioso que puede dañar tu dispositivo, robar datos o tomar control del sistema.' },
  { icon: <Lock size={20} />,      title: 'Phishing',          desc: 'Correos falsos que suplantan entidades legítimas para robar tus credenciales o datos bancarios.' },
  { icon: <Lock size={20} />,      title: 'Ransomware',        desc: 'Cifra tus archivos y exige un pago para liberarlos, a menudo con un plazo límite.' },
  { icon: <Zap size={20} />,       title: 'Ataques DDoS',      desc: 'Inundación de un servidor con tráfico para dejarlo inaccesible a usuarios legítimos.' },
  { icon: <UserRound size={20} />, title: 'Ingeniería Social', desc: 'Manipulación psicológica para engañar a personas y obtener acceso no autorizado.' },
];

// Consejos de seguridad. Se muestran en paralelo con AMENAZAS
// (índice 0 de AMENAZAS junto a índice 0 de CONSEJOS, etc.)
// Deben mantenerse con el mismo número de items que AMENAZAS.
export const CONSEJOS = [
  { title: 'Actualizaciones constantes',    desc: 'Configura actualizaciones automáticas en tu SO, navegadores y apps para cerrar vulnerabilidades conocidas.' },
  { title: 'Contraseñas robustas',          desc: 'Mínimo 12 caracteres con mayúsculas, minúsculas, números y símbolos. Usa un gestor de contraseñas.' },
  { title: 'Autenticación de dos factores', desc: 'El 2FA añade una capa extra: además de tu contraseña, necesitas un segundo código desde tu móvil.' },
  { title: 'Desconfía de lo inesperado',    desc: 'No hagas clic en enlaces ni descargues adjuntos de correos sospechosos, aunque parezcan de fuentes conocidas.' },
  { title: 'Usa VPN en redes públicas',     desc: 'Una VPN cifra tu conexión y protege tus datos de espías en redes Wi-Fi de aeropuertos o cafeterías.' },
];

// Los tres pilares de la ciberseguridad (CIA Triad) + contexto.
// Se renderizan como una timeline vertical en FundamentosSection.
export const PILARES = [
  {
    titulo: 'Confidencialidad',
    desc: 'Solo las personas autorizadas pueden acceder a la información. Esto incluye proteger datos con contraseñas, cifrado y control de accesos.',
    icon: 'lock',
  },
  {
    titulo: 'Integridad',
    desc: 'Los datos no pueden ser modificados sin autorización ni pasar desapercibidos. Garantiza que la información recibida es exactamente la que fue enviada.',
    icon: 'verified_user',
  },
  {
    titulo: 'Disponibilidad',
    desc: 'Los sistemas y datos deben estar accesibles cuando se necesiten. Los ataques como el DDoS buscan precisamente interrumpir esta disponibilidad.',
    icon: 'cloud_done',
  },
  {
    titulo: '¿Por qué importa?',
    desc: 'Los ciberataques cuestan billones al año y afectan a personas, empresas y gobiernos. Entender estos principios es el primer paso para protegerte.',
    icon: 'public',
  },
];
