import React from 'react';
import { Button } from "@/components/ui/button";

const SaicaInfo: React.FC = () => {
  return (
    <div className="w-full max-w-full md:max-w-[400px] p-4 sm:p-6 bg-white rounded-lg shadow-md break-words overflow-hidden flex flex-col items-center">
      <h2 className="text-saica-blue text-center text-sm sm:text-base md:text-xl font-bold mb-2 sm:mb-4 break-words w-full">O QUE É O SISTEMA SAICA?</h2>
      <p className="text-left md:text-center mb-2 sm:mb-4 text-xs sm:text-sm md:text-base break-words w-full">
        É uma plataforma onde é cadastrado o acolhido com fotos, informações pessoais e histórico.
      </p>
      <p className="text-left md:text-center mb-2 sm:mb-4 text-xs sm:text-sm md:text-base break-words w-full">
        O abrigo poderá fornecer acesso aos órgãos como CREAS, CRAS, CAPS, Conselho Tutelar e Casa Lar, sendo também possível a inserção de qualquer evolução por parte destas instituições no cadastro do respectivo acolhido.
      </p>
      <p className="text-left md:text-center mb-4 sm:mb-6 text-xs sm:text-sm md:text-base break-words w-full">
        Desta forma, as informações são unificadas, com segurança e facilidade, criando assim uma rede de informações com históricos a nível nacional.
      </p>
      <div className="flex justify-center w-full">
        <Button className="bg-saica-blue hover:bg-saica-light-blue text-white text-xs sm:text-base px-2 sm:px-4 py-2 w-full max-w-xs sm:w-auto">
          TESTAR A PLATAFORMA
        </Button>
      </div>
    </div>
  );
};

export default SaicaInfo;
