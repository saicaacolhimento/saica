import React from 'react';
import Logo from './Logo';
import { Login } from '@/features/auth/pages/Login';

const Header: React.FC = () => {
  return (
    <header className="w-full p-2 sm:p-4 flex flex-col md:flex-row items-center md:justify-between gap-2">
      <div className="flex-1 min-w-0 flex justify-center md:justify-start w-full">
        <Logo />
      </div>
      <div className="flex-1 min-w-0 flex justify-center w-full">
        <Login />
      </div>
    </header>
  );
};

export default Header;
