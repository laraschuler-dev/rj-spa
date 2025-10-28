// src/components/ui/CitySelect.tsx
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';

interface CitySelectProps {
  state: string;
  value: string;
  onChange: (value: string) => void;
}

const CitySelect: React.FC<CitySelectProps> = ({ state, value, onChange }) => {
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const cache: Record<string, { value: string; label: string }[]> = {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state) return;

    // já tem cache? usa e sai
    if (cache[state]) {
      setCities(cache[state]);
      return;
    }

    setLoading(true);

    axios
      .get(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${state}/municipios`
      )
      .then((res) => {
        const cityOptions = res.data.map((c: any) => ({
          value: c.nome,
          label: c.nome,
        }));

        // salva no cache
        cache[state] = cityOptions;

        setCities(cityOptions);
      })
      .catch(() => setCities([]))
      .finally(() => setLoading(false));
  }, [state]);

  return (
    <Select
      isDisabled={!state}
      isLoading={loading}
      options={cities}
      placeholder={
        state ? 'Selecione a cidade' : 'Selecione um estado primeiro'
      }
      value={cities.find((opt) => opt.value === value) || null}
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

export default CitySelect;
