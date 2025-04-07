
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle } from "lucide-react";

const LoginForm: React.FC = () => {
  return (
    <div className="flex space-x-2 items-center">
      <Input 
        type="text" 
        placeholder="USUÁRIO" 
        className="bg-gray-100 text-xs md:text-sm"
      />
      <Input 
        type="password" 
        placeholder="SENHA" 
        className="bg-gray-100 text-xs md:text-sm"
      />
      <Button className="bg-saica-blue hover:bg-saica-light-blue">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>
      <Button variant="ghost" size="icon">
        <HelpCircle className="h-5 w-5 text-saica-blue" />
      </Button>
    </div>
  );
};

export default LoginForm;
