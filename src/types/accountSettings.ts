// src/types/accountSettings.ts
export interface UserFormData {
  name: string;
  email: string;
  phone: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface DeleteFormData {
  password: string;
  confirmation: string;
}

export interface SocialConnections {
  hasGoogle: boolean;
  connectedProviders: string[];
}

export interface OpenSections {
  account: boolean;
  password: boolean;
  createPassword: boolean;
  social: boolean;
  danger: boolean;
}
