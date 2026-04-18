// TIPOS — Biblioteca pública
// Usados en Biblioteca.tsx y sus subcomponentes
// (FeaturedGrid, ArticlesList, QuizzesList, BibSidebar)


// Tipos de contenido disponibles en la biblioteca
export type TipoContenido = 'articulo' | 'guia' | 'cuestionario';


// Temas/categorías de ciberseguridad disponibles
export type Tema =
  | 'redes'
  | 'cripto'
  | 'acceso'
  | 'usuario'
  | 'datos'
  | 'amenazas';


// Representa un recurso educativo (artículo, guía o cuestionario)
// mapeado desde la respuesta del backend
export interface Recurso {
  id:               string;           // UUID string — viene del backend como string
  tipo:             TipoContenido;
  tema:             string;           // nombre de la categoría (viene del backend)
  titulo:           string;
  descripcion:      string;
  urlRecurso?:      string;           // link externo opcional (PDF, video, etc.)
  tiempoLectura?:   number;           // minutos estimados de lectura
  preguntas?:       number;           // cantidad de preguntas (solo cuestionarios)
  imagen?:          string;           // URL de imagen de portada (opcional)
  esPublico:        boolean;          // si es visible para usuarios no autenticados
  fechaPublicacion?: string;          // ISO string de fecha
}


// Representa un cuestionario en la vista pública
// (versión simplificada, sin preguntas detalladas)
export interface Cuestionario {
  id:              string;            // UUID string — viene del backend como string
  titulo:          string;
  descripcion:     string;
  esActivo:        boolean;
  tiempoLimite?:   number;            // minutos — undefined o 0 = sin límite
  totalPreguntas?: number;            // cantidad total de preguntas
  fechaCreacion?:  string;            // ISO string de fecha
}


// Filtros aplicables a la lista de recursos
export interface FiltrosRecursos {
  tipo?:     TipoContenido | 'all';
  tema?:     string | 'all';
  busqueda?: string;
}


// Lista de temas para el sidebar — incluye opción "Todos"
export const TEMAS: { id: string; label: string }[] = [
  { id: 'all',      label: 'Todos los temas'       },
  { id: 'redes',    label: 'Seguridad en Redes'     },
  { id: 'cripto',   label: 'Criptografía'           },
  { id: 'acceso',   label: 'Control de Acceso'      },
  { id: 'usuario',  label: 'Conciencia del Usuario' },
  { id: 'datos',    label: 'Seguridad de Datos'     },
  { id: 'amenazas', label: 'Detección de Amenazas'  },
];


// Lista de tipos de contenido para el sidebar — incluye opción "Todos"
export const TIPOS: { id: TipoContenido | 'all'; label: string }[] = [
  { id: 'all',          label: 'Todos'         },
  { id: 'articulo',     label: 'Artículos'     },
  { id: 'guia',         label: 'Guías'         },
  { id: 'cuestionario', label: 'Cuestionarios' },
];