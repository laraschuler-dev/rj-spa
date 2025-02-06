import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettier,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    rules: {
      "no-var": "error", // Impede o uso de var
      "semi": ["error", "always"], // Exige ponto e vírgula
      "quotes": ["error", "double"], // Usa aspas duplas
      "indent": ["error", 2], // Força identação de 2 espaços
    },
  },
];
