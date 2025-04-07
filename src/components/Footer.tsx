
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 text-center text-sm text-gray-500 mt-8">
      <div className="text-right px-4">
        <a href="/admin" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          Admin
        </a>
      </div>
      <p>© {new Date().getFullYear()} SAICA - Sistema para Assistência Individual de Crianças e Adolescentes</p>
    </footer>
  );
};

export default Footer;
