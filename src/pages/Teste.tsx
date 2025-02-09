import React from 'react';
import Button from '../components/ui/Button';
import Typography from '../components/ui/Typography';

const Teste = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-100 p-6">
      <Typography variant="h1">Título Principal</Typography>
      <Typography variant="p">Este é um texto padrão.</Typography>
      <Typography variant="small">Texto pequeno e secundário.</Typography>

      <h1 className="text-2xl font-heading">Testando Botões</h1>

      {/* Botões em diferentes variações */}
      <Button variant="primary">Botão Primário</Button>
      <Button variant="secondary">Botão Secundário</Button>
      <Button variant="outline">Botão Outline</Button>
      <Button variant="primary" disabled>
        Botão Desativado
      </Button>
    </div>
  );
};

export default Teste;
