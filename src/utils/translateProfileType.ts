// src/utils/translateProfileType.ts
export const translateProfileType = (type?: string) => {
  const map: Record<string, string> = {
    psr: 'Pessoa em situação de rua',
    volunteer: 'Voluntário(a)',
    ong: 'ONG',
    company: 'Empresa',
    public_institution: 'Instituição Pública',
  };
  return type ? map[type] || type : '';
};
