import React from 'react';
import { useParams } from 'react-router-dom';

export const UserEdit: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Usuário</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p>Formulário de edição do usuário {id} será exibido aqui.</p>
      </div>
    </div>
  );
}; 