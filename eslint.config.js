import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser'; // Parser do TypeScript
import prettier from 'eslint-plugin-prettier';

export default [
  // Configuração base do ESLint
  js.configs.recommended,
  {
    languageOptions: {
      parser: tsParser, // Define o parser do TypeScript
      ecmaVersion: 2020,
      sourceType: 'module', // Permite o uso de import/export
      globals: {
        ...globals.browser,
        React: 'readonly', // Adiciona o React como global
        JSX: 'readonly', // Adiciona JSX como global
        module: 'readonly', // Adiciona module como global
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier, // Adiciona o Prettier como plugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': 'error', // Aplica as regras do Prettier
    },
  },
  {
    // Configuração do TypeScript
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        jsx: true, // Habilita JSX para React
      },
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off', // Exemplo de regra do TypeScript
    },
  },
];
