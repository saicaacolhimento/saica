if (window.location.pathname === '/') {
  localStorage.removeItem('saica-auth-token');
  // Limpa IndexedDB do Supabase
  try {
    const req = window.indexedDB.deleteDatabase('supabase-auth-0');
    req.onsuccess = function () {
      console.log('IndexedDB supabase-auth-0 removido com sucesso');
    };
    req.onerror = function () {
      console.log('Erro ao remover IndexedDB supabase-auth-0');
    };
  } catch (e) {
    console.log('Erro ao tentar limpar IndexedDB:', e);
  }
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
