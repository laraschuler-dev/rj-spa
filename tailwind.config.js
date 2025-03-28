/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Garante que Tailwind seja aplicado a todos os arquivos
  theme: {
    extend: {
      colors: {
        primary: '#004AAD', // Azul profundo
        secondary: '#F25C05', // Laranja vibrante
        accent: '#78C0E0', // Azul claro
        background: '#F8F9FA', // Branco gelo
        text: '#1E293B', // Cor de texto escuro para contraste
        sidebar: '#2D3748', // Cor de fundo da sidebar
        success: '#4CAF50', // Verde esperança
        warning: '#E63946', // Vermelho para alertas
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'], // Para títulos
        body: ['Inter', 'sans-serif'], // Para textos normais
      },
      spacing: {
        2: '8px',
        4: '16px',
        6: '24px',
        8: '32px',
      },
    },
  },
  plugins: [],
};
