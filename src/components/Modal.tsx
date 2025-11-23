import React from 'react';

export const Modal = ({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] relative flex flex-col">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold z-10" onClick={onClose} aria-label="Fechar">×</button>
        <div className="overflow-y-auto flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  );
}; 