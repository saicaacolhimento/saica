import React from 'react';
import Header from '@/components/Header';
import Banner from '@/components/Banner';
import SaicaInfo from '@/components/SaicaInfo';
import NetworkDiagram from '@/components/NetworkDiagram';
import PartnersCarousel from '@/components/PartnersCarousel';
import ContactForm from '@/components/ContactForm';
import ChildrenIllustration from '@/components/ChildrenIllustration';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <Header />
      
      <main className="flex-grow">
        <Banner />
        
        <div className="py-4">
          <ChildrenIllustration />
        </div>
        
        <div className="w-full px-2 sm:px-4 md:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-start w-full">
            <div className="w-full flex justify-center md:justify-end">
              <NetworkDiagram />
            </div>
            <div className="w-full flex justify-center md:justify-start mt-4 md:mt-0">
              <SaicaInfo />
            </div>
          </div>
        </div>
        
        <PartnersCarousel />
        
        <ContactForm />
        
        <div className="py-4">
          <ChildrenIllustration />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
