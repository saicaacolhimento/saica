import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">Página não encontrada</p>
      <Button 
        onClick={() => navigate('/')}
        className="bg-[#6366F1] hover:bg-[#4F46E5] text-white"
      >
        Voltar para a página inicial
      </Button>
    </div>
  );
}; 