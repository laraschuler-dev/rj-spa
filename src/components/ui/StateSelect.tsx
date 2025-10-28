// src/components/ui/StateSelect.tsx
import React from 'react';
import Select from 'react-select';

const brazilianStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
];

interface StateSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const StateSelect: React.FC<StateSelectProps> = ({ value, onChange }) => {
  return (
    <Select
      options={brazilianStates}
      placeholder="Selecione o Estado"
      value={brazilianStates.find((opt) => opt.value === value) || null}
      onChange={(selected) => onChange(selected?.value || '')}
      styles={{
        control: (base) => ({
          ...base,
          borderRadius: '0.5rem',
          borderColor: '#ccc',
          padding: '2px',
          boxShadow: 'none',
          ':hover': { borderColor: 'primary' },
        }),
      }}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: '#e0e7ff',
          primary: '#004AAD',
        },
      })}
    />
  );
};

export default StateSelect;
