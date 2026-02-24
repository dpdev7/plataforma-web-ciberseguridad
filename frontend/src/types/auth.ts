export interface PasswordFeedback {
  warning: string;
  suggestions: string[];
}

export interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  percentage: number;
  feedback?: PasswordFeedback;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
