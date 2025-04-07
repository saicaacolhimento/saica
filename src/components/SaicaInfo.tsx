
import React from 'react';
import { Button } from "@/components/ui/button";

const SaicaInfo: React.FC = () => {
  return (
    <div className="border border-saica-blue p-6 max-w-md mx-auto md:mx-0 mt-8 bg-white rounded-lg shadow-md">
      <h2 className="text-saica-blue text-center text-xl font-bold mb-4">O QUE É A SAICA?</h2>
      <p className="text-center mb-4">
        É uma plataforma onde é cadastrado o acolhido com fotos, informações pessoais e histórico.
      </p>
      <p className="text-center mb-4">
        O abrigo poderá fornecer acesso aos órgãos como CREAS, CRAS, CAPS, Conselho Tutelar e Casa Lar, sendo também possível a inserção de qualquer evolução por parte destas instituições no cadastro do respectivo acolhido.
      </p>
      <p className="text-center mb-6">
        Desta forma, as informações são unificadas, com segurança e facilidade, criando assim uma rede de informações com históricos a nível nacional.
      </p>
      <div className="flex justify-center">
        <Button className="bg-saica-blue hover:bg-saica-light-blue text-white">
          TESTAR A PLATAFORMA
        </Button>
      </div>
    </div>
  );
};

export default SaicaInfo;
