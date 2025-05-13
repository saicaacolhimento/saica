import { supabase } from '@/config/supabase'
import {
  Acolhido,
  CreateAcolhidoData,
  UpdateAcolhidoData,
  AcolhidoFoto,
  CreateAcolhidoFotoData,
  UpdateAcolhidoFotoData
} from '@/types/acolhido'

export const acolhidoService = {
  supabase,

  // Acolhidos
  async getAcolhidos(page = 1, perPage = 10): Promise<{ data: Acolhido[], total: number }> {
    try {
      console.log('[acolhidoService] Iniciando busca de acolhidos...');
      
      // Primeiro, obter o total de registros
      const { count, error: countError } = await supabase
        .from('acolhidos')
        .select('*', { count: 'exact', head: true });

      if (countError) {
        console.error('[acolhidoService] Erro ao contar acolhidos:', countError);
        throw countError;
      }

      // Depois, buscar os registros com paginação e relacionamentos
      const { data, error } = await supabase
        .from('acolhidos')
        .select(`
          *,
          empresa:empresa_id (id, nome),
          fotos:acolhido_fotos (id, url)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1);

      if (error) {
        console.error('[acolhidoService] Erro ao buscar acolhidos:', error);
        throw error;
      }

      console.log('[acolhidoService] Acolhidos encontrados:', data?.length);
      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('[acolhidoService] Erro ao buscar acolhidos:', error);
      throw error;
    }
  },

  async getAcolhidoById(id: string): Promise<Acolhido> {
    try {
      console.log('[acolhidoService] Buscando acolhido por ID:', id);
      
      // Verificar se há uma sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const { data, error } = await supabase
        .from('acolhidos')
        .select(`
          *,
          fotos:acolhido_fotos (id, url)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('[acolhidoService] Erro ao buscar acolhido:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Acolhido não encontrado');
      }

      return data;
    } catch (error) {
      console.error('[acolhidoService] Erro ao buscar acolhido:', error);
      throw error;
    }
  },

  async createAcolhido(data: CreateAcolhidoData): Promise<Acolhido> {
    try {
      console.log('[acolhidoService] Criando novo acolhido...');
      
      // Verificar se há uma sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      // Tratamento para campos de data vazios
      const payload = {
        ...data,
        data_nascimento: data.data_nascimento === '' ? null : data.data_nascimento,
        data_entrada: (data as any).data_entrada === '' ? null : (data as any).data_entrada,
        data_inativacao: (data as any).data_inativacao === '' ? null : (data as any).data_inativacao,
        status: 'ativo'
      };

      const { data: acolhido, error } = await supabase
        .from('acolhidos')
        .insert([payload])
        .select(`
          *,
          empresa:empresa_id (id, nome),
          fotos:acolhido_fotos (id, url)
        `)
        .single();

      if (error) {
        console.error('[acolhidoService] Erro ao criar acolhido:', error);
        throw error;
      }

      if (!acolhido) {
        throw new Error('Erro ao criar acolhido: nenhum dado retornado');
      }

      console.log('[acolhidoService] Acolhido criado com sucesso:', acolhido.id);
      return acolhido;
    } catch (error) {
      console.error('[acolhidoService] Erro ao criar acolhido:', error);
      throw error;
    }
  },

  async updateAcolhido(id: string, data: UpdateAcolhidoData): Promise<Acolhido> {
    try {
      console.log('[acolhidoService] Atualizando acolhido:', id);
      
      // Verificar se há uma sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const { data: acolhido, error } = await supabase
        .from('acolhidos')
        .update(data)
        .eq('id', id)
        .select(`
          *,
          empresa:empresa_id (id, nome),
          fotos:acolhido_fotos (id, url)
        `)
        .single();

      if (error) {
        console.error('[acolhidoService] Erro ao atualizar acolhido:', error);
        throw error;
      }

      if (!acolhido) {
        throw new Error('Erro ao atualizar acolhido: nenhum dado retornado');
      }

      console.log('[acolhidoService] Acolhido atualizado com sucesso:', id);
      return acolhido;
    } catch (error) {
      console.error('[acolhidoService] Erro ao atualizar acolhido:', error);
      throw error;
    }
  },

  async deleteAcolhido(id: string): Promise<void> {
    try {
      console.log('[acolhidoService] Deletando acolhido:', id);
      
      // Verificar se há uma sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const { error } = await supabase
        .from('acolhidos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[acolhidoService] Erro ao deletar acolhido:', error);
        throw error;
      }

      console.log('[acolhidoService] Acolhido deletado com sucesso:', id);
    } catch (error) {
      console.error('[acolhidoService] Erro ao deletar acolhido:', error);
      throw error;
    }
  },

  // Fotos
  async getAcolhidoFotos(acolhidoId: string): Promise<AcolhidoFoto[]> {
    try {
      console.log('[acolhidoService] Buscando fotos do acolhido:', acolhidoId);
      
      // Verificar se há uma sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const { data, error } = await supabase
        .from('acolhido_fotos')
        .select('*')
        .eq('acolhido_id', acolhidoId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[acolhidoService] Erro ao buscar fotos:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('[acolhidoService] Erro ao buscar fotos:', error);
      throw error;
    }
  },

  async createAcolhidoFoto(data: CreateAcolhidoFotoData): Promise<AcolhidoFoto> {
    try {
      console.log('[acolhidoService] Criando nova foto para acolhido:', data.acolhido_id);
      
      // Verificar se há uma sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const { data: foto, error } = await supabase
        .from('acolhido_fotos')
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error('[acolhidoService] Erro ao criar foto:', error);
        throw error;
      }

      if (!foto) {
        throw new Error('Erro ao criar foto: nenhum dado retornado');
      }

      console.log('[acolhidoService] Foto criada com sucesso:', foto.id);
      return foto;
    } catch (error) {
      console.error('[acolhidoService] Erro ao criar foto:', error);
      throw error;
    }
  },

  async updateAcolhidoFoto(id: string, data: UpdateAcolhidoFotoData): Promise<AcolhidoFoto> {
    try {
      console.log('[acolhidoService] Atualizando foto:', id);
      
      // Verificar se há uma sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const { data: foto, error } = await supabase
        .from('acolhido_fotos')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[acolhidoService] Erro ao atualizar foto:', error);
        throw error;
      }

      if (!foto) {
        throw new Error('Erro ao atualizar foto: nenhum dado retornado');
      }

      console.log('[acolhidoService] Foto atualizada com sucesso:', id);
      return foto;
    } catch (error) {
      console.error('[acolhidoService] Erro ao atualizar foto:', error);
      throw error;
    }
  },

  async deleteAcolhidoFoto(id: string): Promise<void> {
    try {
      console.log('[acolhidoService] Deletando foto:', id);
      
      // Verificar se há uma sessão ativa
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Sessão não encontrada');
      }

      const { error } = await supabase
        .from('acolhido_fotos')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[acolhidoService] Erro ao deletar foto:', error);
        throw error;
      }

      console.log('[acolhidoService] Foto deletada com sucesso:', id);
    } catch (error) {
      console.error('[acolhidoService] Erro ao deletar foto:', error);
      throw error;
    }
  }
} 