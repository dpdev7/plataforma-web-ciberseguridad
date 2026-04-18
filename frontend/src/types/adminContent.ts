// TIPOS — Panel de administración
// Usados en ContentPage, CuestionariosPage
// y sus modales respectivos

// Solo artículos y guías (los cuestionarios tienen su propia interfaz)
export type TipoRecurso = 'articulo' | 'guia';

// Recurso educativo (artículo o guía) — mapeado desde la BD
// El id es UUID string que viene del backend Django
export interface Recurso {
  id:             string;       // UUID del backend
  titulo:         string;
  descripcion:    string;
  urlRecurso:     string;       // link externo del recurso (PDF, video, etc.)
  tipo:           TipoRecurso;
  categoria:      string;       // id de categoría (ej: 'redes', 'cripto')
  esPublico:      boolean;      // visible para usuarios no autenticados
  imagen?:        string;       // URL de imagen de portada (opcional)
  contenido?:     string;       // texto largo del artículo/guía (opcional)
  autor?:         string;       // nombre del autor (opcional)
  tiempoLectura?: number;       // minutos estimados de lectura (opcional)
}

// Cuestionario con sus preguntas y opciones — mapeado desde la BD
export interface Cuestionario {
  id:              string;      // UUID del backend
  titulo:          string;
  descripcion:     string;
  tiempoLimite:    number;      // minutos — 0 = sin límite
  esActivo:        boolean;     // si aparece disponible para los usuarios
  totalPreguntas?: number;      // cantidad de preguntas (calculado al hacer fetch)
  preguntas?:      Pregunta[];  // detalle completo (opcional, solo si se necesita)
}

// Pregunta de un cuestionario
export interface Pregunta {
  id:        string;      // UUID del backend (pregunta_id)
  enunciado: string;      // texto de la pregunta
  opciones:  Opcion[];    // lista de opciones de respuesta
}

// Opción de respuesta de una pregunta
export interface Opcion {
  id:                string;   // UUID del backend (opcion_id)
  texto:             string;   // texto de la opción
  esCorrecta:        boolean;  // solo una opción por pregunta puede ser correcta
  retroalimentacion?: string;  // mensaje que se muestra al responder (opcional)
}

// Categorías disponibles para recursos — sincronizadas con la BD
export const CATEGORIAS = [
  { id: 'redes',    label: 'Seguridad en Redes'    },
  { id: 'cripto',   label: 'Criptografía'           },
  { id: 'acceso',   label: 'Control de Acceso'      },
  { id: 'usuario',  label: 'Conciencia del Usuario' },
  { id: 'datos',    label: 'Seguridad de Datos'     },
  { id: 'amenazas', label: 'Detección de Amenazas'  },
];