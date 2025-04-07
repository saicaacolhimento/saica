import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <h1 className="text-4xl font-bold text-saica-blue mb-4">404</h1>
      <p className="text-xl mb-8">Página não encontrada</p>
      <Button asChild>
        <Link to="/">Voltar para o início</Link>
      </Button>
    </div>
  );
} 