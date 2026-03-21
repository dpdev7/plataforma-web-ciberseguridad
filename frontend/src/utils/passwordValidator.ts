import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommon from '@zxcvbn-ts/language-common';
import * as zxcvbnEn from '@zxcvbn-ts/language-en'; // Revisar tamaño y relevancia
import * as zxcvbnEs from '@zxcvbn-ts/language-es-es';
import type { PasswordStrength } from '../types/auth'; 

// Inicializamos diccionarios
zxcvbnOptions.setOptions({
  dictionary: {
    ...zxcvbnCommon.dictionary,
    ...zxcvbnEn.dictionary,
    ...zxcvbnEs.dictionary,
  },
  graphs: zxcvbnCommon.adjacencyGraphs,
  translations: zxcvbnEs.translations,
});

export const validatePassword = (
  password: string,
  userInputs: string[] = [] // Se envían [email, username]
): PasswordStrength => {
  if (!password) {
    return {
      score: 0,
      label: 'Muy débil',
      color: '#ef4444',
      percentage: 0,
      feedback: { warning: '', suggestions: [] }
    };
  }

  // 1. Evaluamos la contraseña con zxcvbn
  const result = zxcvbn(password, userInputs);

  const containsDictionaryWord = result.sequence.some(
    (match) => match.pattern === 'dictionary'
  );

  // 2. RESTRICCIÓN ESTRICTA: Si tiene palabras de diccionario, forzamos "Inválida"
  if (containsDictionaryWord) {
    return {
      score: 0,
      label: 'Inválida',
      color: '#ef4444', 
      percentage: 20, 
      feedback: {
        warning: 'No se permiten palabras comunes, nombres ni tus datos personales.',
        suggestions: ['Añade palabras inusuales o caracteres aleatorios para que sea única.']
      }
    };
  }

  // 3. Evaluar los 4 requisitos
  const hasLength = password.length >= 12;
  const hasNoCommonWords = password.length > 0 && !containsDictionaryWord; // Si llegó aquí, es true
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasNumberSymbol = /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);

  // Contamos requisitos cumplidos
  let metCount = 0;
  if (hasLength) metCount++;
  if (hasNoCommonWords) metCount++;
  if (hasUpperLower) metCount++;
  if (hasNumberSymbol) metCount++;

  // 4. LÓGICA DE FUERZA:
  let label = 'Muy débil';
  let color = '#ef4444'; // Rojo
  let percentage = 20;
  let score = 0;

  // Si la contraseña tiene menos de 8 caracteres, SIEMPRE será "Muy débil" sin importar qué símbolos tenga.
  if (password.length < 8) {
    label = 'Muy débil';
    color = '#ef4444';
    percentage = 20;
    score = 0;
  } 
  // Si tiene 8+ caracteres, pero solo cumple 2 o menos requisitos (ej. solo no tiene palabras comunes y letras)
  else if (metCount <= 2) {
    label = 'Débil';
    color = '#f97316'; // Naranja
    percentage = 40;
    score = 1;
  } 
  // Si cumple 3 requisitos (ej. tiene 12+ caracteres, mayúsculas y no palabras comunes, pero le faltan símbolos)
  else if (metCount === 3) {
    label = 'Media';
    color = '#eab308'; // Amarillo
    percentage = 70;
    score = 2;
  } 
  // Solo es fuerte si cumple LOS 4 requisitos exactos
  else if (metCount === 4) {
    label = 'Fuerte';
    color = '#22c55e'; // Verde
    percentage = 100;
    score = 3;
  }

  return {
    score,
    label,
    color,
    percentage,
    feedback: {
      warning: result.feedback.warning || '',
      suggestions: result.feedback.suggestions
    }
  };
};

export const getPasswordRequirements = (password: string) => {
  const hasLength = password.length >= 12;
  const result = zxcvbn(password);
  
  // Verificamos si encontró palabras de diccionario o inputs del usuario
  const containsDictionaryWord = result.sequence.some(
    (match) => match.pattern === 'dictionary'
  );

  // Se cumple solo si escribieron algo y NO contiene palabras de diccionario
  const hasNoCommonWords = password.length > 0 && !containsDictionaryWord;

  return [
    {
      met: hasLength,
      hasError: false,
      text: 'Al menos 12 caracteres de longitud'
    },
    {
      met: hasNoCommonWords,
      hasError: password.length > 0 && containsDictionaryWord, 
      text: containsDictionaryWord 
            ? 'Contiene palabras comunes o datos personales' 
            : 'No usa palabras comunes del diccionario'
    },
    {
      met: /[a-z]/.test(password) && /[A-Z]/.test(password),
      hasError: false,
      text: 'Combinación de mayúsculas y minúsculas'
    },
    {
      met: /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password),
      hasError: false,
      text: 'Incluye números y símbolos'
    }
  ];
};
