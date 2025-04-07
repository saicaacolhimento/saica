
import React from 'react';
import Logo from './Logo';
import LoginForm from './LoginForm';

const Header: React.FC = () => {
  return (
    <header className="w-full p-4 flex justify-between items-center">
      <div className="flex-1"></div>
      <div className="flex-1 flex justify-center">
        <Logo />
      </div>
      <div className="flex-1 flex justify-end">
        <LoginForm />
      </div>
    </header>
  );
};

export default Header;
