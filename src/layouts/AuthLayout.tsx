import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import headerImage from '@/assets/images/header-kids.png';
import logoSaica from '@/assets/images/logo-saica.png';
import diagramaSaica from '@/assets/images/diagrama-saica.png';
import { Login } from '@/features/auth/pages/Login';

export default function AuthLayout() {
  const [showContact, setShowContact] = useState(false);
  const [contactForm, setContactForm] = useState({ nome: '', email: '', mensagem: '' });
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.nome || !contactForm.email || !contactForm.mensagem) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      // TODO: Implementar envio real (ex: Supabase edge function ou backend endpoint)
      await new Promise(resolve => setTimeout(resolve, 500));
      toast({ title: 'Mensagem enviada', description: 'Entraremos em contato em breve.' });
      setContactForm({ nome: '', email: '', mensagem: '' });
      setShowContact(false);
    } catch {
      toast({ title: 'Erro', description: 'Erro ao enviar mensagem. Tente novamente.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full bg-white relative">
        <div className="w-full">
          <img 
            src={headerImage} 
            alt="Crianças desenhando" 
            className="w-full h-auto object-cover max-h-[400px] md:max-h-[570px]"
          />
        </div>
        <div className="absolute top-4 right-4 md:top-10 md:right-10">
          <Login />
        </div>
      </header>

      <div className="flex justify-center -mt-10 md:-mt-16 relative z-10">
        <img
          src={logoSaica}
          alt="Logo SAICA"
          className="w-20 md:w-32 h-auto drop-shadow-md"
        />
      </div>

      <div className="w-full bg-[#6366F1] text-white py-4 md:py-6 mt-4 md:mt-6">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-base md:text-[2em] font-semibold">
            Sistema de Acompanhamento Integrado de Crianças e Adolescentes
          </h1>
          <p className="text-sm md:text-[1.2em] mt-[12px] opacity-90">
            Uma plataforma para auxiliar na integração entre CRAS, CAPS, CREAS,
            Conselho Tutelar e Abrigos de uma forma rápida e segura
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          <div className="w-full md:w-1/2 flex justify-center md:pl-20 md:sticky md:top-8">
            <img 
              src={diagramaSaica}
              alt="Diagrama de integração SAICA"
              className="w-full max-w-[500px] h-auto object-contain"
            />
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-[500px] w-full">
              <h2 className="text-[#6366F1] text-xl md:text-2xl font-bold mb-4 text-center">O QUE É O SISTEMA SAICA?</h2>
              <div className="space-y-4 text-gray-600 text-base md:text-lg mb-8">
                <p>É uma plataforma onde o Abrigo cadastra o acolhido com todas informações pessoais.</p>
                <p>Os órgãos como CREAS, CRAS, CAPS, Conselho Tutelar acessam estas informações e podem também fazer a inserção de qualquer evolução por parte destas instituições no cadastro do respectivo acolhido.</p>
                <p>Desta forma, as informações são unificadas, com segurança e facilidade, criando assim uma rede de informações com históricos a nível nacional.</p>
                <p>Nossa plataforma tem além do cadastro completo do acolhido um sistema de agenda e mensagem integrado entre todos e um sistema único.</p>
              </div>
              
              <div className="text-center">
                <Button
                  onClick={() => setShowContact(!showContact)}
                  className="bg-[#6366F1] hover:bg-[#4F46E5] text-white py-2 px-8 rounded transition-colors font-semibold"
                >
                  {showContact ? 'Fechar Contato' : 'Entrar em Contato'}
                </Button>
              </div>

              {showContact && (
                <form className="space-y-4 mt-6" onSubmit={handleContactSubmit}>
                  <div>
                    <Input
                      placeholder="NOME"
                      value={contactForm.nome}
                      onChange={e => setContactForm(prev => ({ ...prev, nome: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                      required
                      disabled={sending}
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="E-MAIL"
                      value={contactForm.email}
                      onChange={e => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50"
                      required
                      disabled={sending}
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="MENSAGEM"
                      value={contactForm.mensagem}
                      onChange={e => setContactForm(prev => ({ ...prev, mensagem: e.target.value }))}
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded bg-gray-50 resize-none"
                      required
                      disabled={sending}
                    />
                  </div>
                  <div>
                    <Button
                      type="submit"
                      className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white py-2 px-4 rounded transition-colors"
                      disabled={sending}
                    >
                      {sending ? 'ENVIANDO...' : 'ENVIAR MENSAGEM'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full mt-auto bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; {new Date().getFullYear()} SAICA - Sistema de Acompanhamento Integrado de Crianças e Adolescentes
        </div>
      </footer>
    </div>
  );
}
