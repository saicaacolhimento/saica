import React from 'react';
import { useParams } from 'react-router-dom';

export const UserDetails: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Usuário</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p>Detalhes do usuário {id} serão exibidos aqui.</p>
      </div>
    </div>
  );
}; 