import React from 'react';

interface AgendaDayListProps {
  agendamentos: any[];
  onSelect: (agendamento: any) => void;
  onCreate: () => void;
}

export const AgendaDayList: React.FC<AgendaDayListProps> = ({ agendamentos, onSelect, onCreate }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
      <div className="flex justify-end mb-4">
        <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300" onClick={onCreate}>
          CRIAR AGENDAMENTO
        </button>
      </div>
      <h2 className="text-base font-bold text-center uppercase mb-2">Agendamentos do Mês</h2>
      <div className="flex-1 overflow-y-auto mt-0">
        {agendamentos.length === 0 ? (
          <div className="text-gray-500 text-center mt-2">Nenhum agendamento para este dia.</div>
        ) : (
          <table className="w-full text-sm mt-0">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-1 px-2 text-left">Assunto</th>
                <th className="py-1 px-2 text-left">Data</th>
                <th className="py-1 px-2 text-left">Hora</th>
                <th className="py-1 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((ag, idx) => {
                const data = ag.data_hora ? new Date(ag.data_hora) : null;
                const dataStr = data ? data.toLocaleDateString('pt-BR') : '-';
                const horaStr = ag.data_hora ? ag.data_hora.substring(11, 16) : '-';
                return (
                  <tr key={ag.id || idx} className="border-b hover:bg-blue-50">
                    <td className="py-1 px-2 font-semibold">{ag.titulo}</td>
                    <td className="py-1 px-2">{dataStr}</td>
                    <td className="py-1 px-2">{horaStr}</td>
                    <td className="py-1 px-2">
                      <button className="text-blue-600 hover:underline" onClick={() => onSelect(ag)}>Ver mais</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}; 