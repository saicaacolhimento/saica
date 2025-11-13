import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactForm: React.FC = () => {
  return (
    <div className="w-full max-w-full sm:max-w-xl mx-auto mt-8 sm:mt-12 px-2 sm:px-4">
      <h2 className="text-saica-blue text-center text-lg sm:text-xl font-bold mb-2">
        Gostaria de saber mais sobre o SAICA?
      </h2>
      <p className="text-center text-xs sm:text-sm mb-6">Nos envie uma mensagem</p>
      
      <div className="space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <Input placeholder="NOME" className="bg-gray-100 text-xs sm:text-base" />
        <Input placeholder="E-MAIL" className="bg-gray-100 text-xs sm:text-base" />
        <Textarea placeholder="MENSAGEM" className="bg-gray-100 min-h-[80px] sm:min-h-[100px] text-xs sm:text-base" />
        
        <div className="flex justify-end">
          <Button className="bg-saica-blue hover:bg-saica-light-blue text-xs sm:text-base px-2 sm:px-4 py-1 sm:py-2">
            ENVIAR MENSAGEM
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
