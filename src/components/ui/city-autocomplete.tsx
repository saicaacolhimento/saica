import { useState, useEffect } from 'react';
import { Input } from './input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface CityAutocompleteProps {
  value: string;
  onCityChange: (city: string) => void;
  onStateChange: (state: string) => void;
  className?: string;
}

// Lista estática de estados para referência rápida
const ESTADOS = {
  'AC': 'Acre',
  'AL': 'Alagoas',
  'AP': 'Amapá',
  'AM': 'Amazonas',
  'BA': 'Bahia',
  'CE': 'Ceará',
  'DF': 'Distrito Federal',
  'ES': 'Espírito Santo',
  'GO': 'Goiás',
  'MA': 'Maranhão',
  'MT': 'Mato Grosso',
  'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais',
  'PA': 'Pará',
  'PB': 'Paraíba',
  'PR': 'Paraná',
  'PE': 'Pernambuco',
  'PI': 'Piauí',
  'RJ': 'Rio de Janeiro',
  'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul',
  'RO': 'Rondônia',
  'RR': 'Roraima',
  'SC': 'Santa Catarina',
  'SP': 'São Paulo',
  'SE': 'Sergipe',
  'TO': 'Tocantins'
};

export function CityAutocomplete({
  value,
  onCityChange,
  onStateChange,
  className
}: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<Array<{ city: string; state: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      if (inputValue.length < 3) {
        setCities([]);
        return;
      }
      
      setLoading(true);
      try {
        const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome`);
        if (!response.ok) {
          throw new Error('Falha ao buscar cidades');
        }
        
        const data = await response.json();
        const filteredCities = data
          .filter((city: any) => 
            city.nome.toLowerCase().includes(inputValue.toLowerCase())
          )
          .map((city: any) => ({
            city: city.nome,
            state: city.microrregiao.mesorregiao.UF.sigla
          }))
          .slice(0, 10);
        
        setCities(filteredCities);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchCities, 500);
    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          onCityChange(newValue);
          setInputValue(newValue);
          if (newValue.length >= 3) {
            setOpen(true);
          }
        }}
        placeholder="Digite o nome da cidade..."
        className="h-8 border-2 border-gray-400"
      />
      
      {open && inputValue.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
          {loading ? (
            <div className="p-2 text-sm text-gray-500">Buscando...</div>
          ) : cities.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">Nenhuma cidade encontrada</div>
          ) : (
            <ul className="max-h-60 overflow-auto">
              {cities.map((item) => (
                <li
                  key={`${item.city}-${item.state}`}
                  className="px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    onCityChange(item.city);
                    onStateChange(item.state);
                    setOpen(false);
                    setInputValue(item.city);
                  }}
                >
                  {item.city} - {item.state}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
} 