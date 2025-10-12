const formatDateBR = (dateString: string) => {
  if (!dateString) return '';

  try {
    // Se for apenas data (YYYY-MM-DD), trata como data local
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      const date = new Date(year, month - 1, day); // Mês é 0-indexed
      return date.toLocaleDateString('pt-BR');
    }

    // Se for ISO string, converte normalmente
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return dateString; // Fallback
  }
};

export default formatDateBR;
