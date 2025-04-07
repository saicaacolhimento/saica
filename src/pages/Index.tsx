
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
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        <Banner />
        
        <div className="py-4">
          <ChildrenIllustration />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <NetworkDiagram />
            </div>
            <div>
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
