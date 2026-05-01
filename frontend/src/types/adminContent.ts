// TIPOS — Panel de administración
// Usados en ContentPage, CuestionariosPage
// y sus modales respectivos

// Solo artículos y guías (los cuestionarios tienen su propia interfaz)
export type TipoRecurso = 'articulo' | 'guia';

// Recurso educativo (artículo o guía) — mapeado desde la BD
// El id es UUID string que viene del backend Django
export interface Recurso {
  id:             string;
  titulo:         string;
  descripcion:    string;
  urlRecurso:     string;
  tipo:           TipoRecurso;
  categoria:      string;       // ← ahora guarda el UUID (categoria_id)
  categoriaNombre?: string;     // ← nuevo: nombre para mostrar en tabla
  esPublico:      boolean;
  imagen?:        string;
  contenido?:     string;
  autor?:         string;
  tiempoLectura?: number;
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