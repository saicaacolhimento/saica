import { supabase } from '@/config/supabase';
import { v4 as uuidv4 } from 'uuid';
import type { Shelter, CreateShelterData, UpdateShelterData, Caps, Creas } from '@/types/shelter';

export const shelterService = {
  // ... existing code ...

  async getCaps(page = 1, pageSize = 20): Promise<Caps[]> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from('caps')
      .select('*')
      .eq('status', 'ativo')
      .order('nome')
      .range(from, to);

    if (error) throw error;
    return data;
  },

  async getCreas(page = 1, pageSize = 20): Promise<Creas[]> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from('creas')
      .select('*')
      .eq('status', 'ativo')
      .order('nome')
      .range(from, to);

    if (error) throw error;
    return data;
  },

  // ... existing code ...
}; 