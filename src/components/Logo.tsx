
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-saica-blue">
        <svg width="100" height="100" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M250 0L0 250V500H500V250L250 0Z" fill="#6366F1" />
          <path d="M125 250V450H375V250M125 250C125 350 250 400 250 250C250 400 375 350 375 250M125 250L250 100L375 250" stroke="white" strokeWidth="30" />
          <text x="125" y="550" fontSize="120" fontWeight="bold" fill="#6366F1">SAICA</text>
        </svg>
      </div>
    </div>
  );
};

export default Logo;
