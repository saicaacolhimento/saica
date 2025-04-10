import React from 'react';
import Logo from './Logo';
import { Login } from '@/features/auth/pages/Login';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 flex justify-between items-center">
      <div className="flex-1"></div>
      <div className="flex-1 flex justify-center">
        <Logo />
      </div>
      <div className="flex-1 flex justify-end">
        <Login />
      </div>
    </header>
  );
};

export default Header;
