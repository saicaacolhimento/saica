
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const ContactForm: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto mt-12 px-4">
      <h2 className="text-saica-blue text-center text-xl font-bold mb-2">
        Gostaria de saber mais sobre o SAICA?
      </h2>
      <p className="text-center text-sm mb-6">Nos envie uma mensagem</p>
      
      <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <Input placeholder="NOME" className="bg-gray-100" />
        <Input placeholder="E-MAIL" className="bg-gray-100" />
        <Textarea placeholder="MENSAGEM" className="bg-gray-100 min-h-[100px]" />
        
        <div className="flex justify-end">
          <Button className="bg-saica-blue hover:bg-saica-light-blue">
            ENVIAR MENSAGEM
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
