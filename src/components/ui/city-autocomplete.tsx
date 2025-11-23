import { useState, useEffect } from 'react';
import { Input } from './input';
import cidadesData from '@/data/cidades1.json.json';

interface CityAutocompleteProps {
  value: string;
  onCityChange: (city: string) => void;
  onStateChange: (state: string) => void;
  className?: string;
}

export function CityAutocomplete({
  value,
  onCityChange,
  onStateChange,
  className
}: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<Array<{ city: string; state: string }>>([]);
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue.length < 3) {
      setFilteredCities([]);
      return;
    }

    const results = cidadesData.estados.flatMap(estado => 
      estado.cidades
        .filter(cidade => cidade.toLowerCase().includes(inputValue.toLowerCase()))
        .map(cidade => ({ city: cidade, state: estado.sigla }))
    ).slice(0, 10);

    setFilteredCities(results);
  }, [inputValue]);

  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => {
          const newValue = e.target.value;
          onCityChange(newValue);
          setInputValue(newValue);
          if (newValue.length >= 3) {
            setOpen(true);
          }
        }}
        placeholder="Digite o nome da cidade..."
        className="h-8"
      />
      {open && inputValue.length >= 3 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
          {filteredCities.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">Nenhuma cidade encontrada</div>
          ) : (
            <ul className="max-h-60 overflow-auto">
              {filteredCities.map((item) => (
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