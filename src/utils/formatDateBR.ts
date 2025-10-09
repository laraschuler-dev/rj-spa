const formatDateBR = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR'); // Exibe como DD/MM/AAAA
};

export default formatDateBR;
