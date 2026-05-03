import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommon from '@zxcvbn-ts/language-common';
import * as zxcvbnEn from '@zxcvbn-ts/language-en';
import * as zxcvbnEs from '@zxcvbn-ts/language-es-es';
import type { PasswordStrength } from '../types/auth';

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
  userInputs: string[] = []
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

  const result = zxcvbn(password, userInputs);

  const containsDictionaryWord = result.sequence.some(
    (match) => match.pattern === 'dictionary'
  );

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

  // Requisitos alineados con el backend Django
  const hasLength      = password.length >= 8;
  const hasNoCommonWords = password.length > 0 && !containsDictionaryWord;
  const hasUpperLower  = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const hasSpecial     = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let metCount = 0;
  if (hasLength)       metCount++;
  if (hasNoCommonWords) metCount++;
  if (hasUpperLower)   metCount++;
  if (hasSpecial)      metCount++;

  let label      = 'Muy débil';
  let color      = '#ef4444';
  let percentage = 20;
  let score      = 0;

  if (password.length < 8) {
    label      = 'Muy débil';
    color      = '#ef4444';
    percentage = 20;
    score      = 0;
  } else if (metCount <= 2) {
    label      = 'Débil';
    color      = '#f97316';
    percentage = 40;
    score      = 1;
  } else if (metCount === 3) {
    label      = 'Media';
    color      = '#eab308';
    percentage = 70;
    score      = 2;
  } else if (metCount === 4) {
    label      = 'Fuerte';
    color      = '#22c55e';
    percentage = 100;
    score      = 3;
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
  const result = zxcvbn(password);

  const containsDictionaryWord = result.sequence.some(
    (match) => match.pattern === 'dictionary'
  );

  const hasNoCommonWords = password.length > 0 && !containsDictionaryWord;

  return [
    {
      met: password.length >= 8,
      hasError: false,
      text: 'Al menos 8 caracteres de longitud'
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
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasError: false,
      text: 'Al menos un carácter especial (!@#$%...)'
    }
  ];
};