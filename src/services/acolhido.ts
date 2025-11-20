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
  // Acolhidos
  async getAcolhidos(page = 1, perPage = 10): Promise<{ data: Acolhido[], total: number }> {
    try {
      console.log('[acolhidoService] Iniciando busca de acolhidos...', { page, perPage });
      
      // Buscar dados completos do usuário para filtrar
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Verificar se é master
      const { data: masterCheck } = await supabase
        .from('master_admin')
        .select('id')
        .eq('id', user.id)
        .single();

      const isMaster = !!masterCheck;

      let empresaId: string | null = null;
      if (!isMaster) {
        // Buscar empresa_id do usuário
        const { data: userData } = await supabase
          .from('usuarios')
          .select('empresa_id')
          .eq('id', user.id)
          .single();
        
        empresaId = userData?.empresa_id || null;
      }

      // Buscar acolhidos com filtro baseado no role
      let query = supabase
        .from('acolhidos')
        .select('*', { count: 'exact' });

      // Se não for master, filtrar por empresa
      if (!isMaster && empresaId) {
        query = query.eq('abrigo_id', empresaId);
      }

      // Buscar com paginação
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1);

      if (error) {
        console.error('[acolhidoService] Erro ao buscar acolhidos:', error);
        throw error;
      }

      console.log('[acolhidoService] ✅ Acolhidos encontrados:', data?.length || 0, 'de', count || 0);

      return {
        data: (data || []) as Acolhido[],
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
      const { data, error } = await supabase
        .from('acolhidos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('[acolhidoService] Erro ao buscar acolhido:', error);
        console.error('[acolhidoService] Detalhes do erro:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      if (!data) {
        throw new Error('Acolhido não encontrado');
      }

      console.log('[acolhidoService] ✅ Acolhido encontrado:', { id: data.id, nome: data.nome, abrigo_id: data.abrigo_id });
      return data;
    } catch (error) {
      console.error('[acolhidoService] Erro ao buscar acolhido:', error);
      throw error;
    }
  },

  async createAcolhido(data: CreateAcolhidoData): Promise<Acolhido> {
    try {
      console.log('[acolhidoService] Criando novo acolhido...');
      console.log('[acolhidoService] Dados recebidos:', JSON.stringify(data, null, 2));
      
      // Tratamento para campos de data vazios
      const payload: any = {
        nome: data.nome,
        data_nascimento: data.data_nascimento === '' ? null : data.data_nascimento,
        nome_mae: data.nome_mae || null, // Permitir null se não fornecido
        abrigo_id: data.abrigo_id, // ⚠️ CRÍTICO: deve estar preenchido
        status: 'ativo',
        genero: data.genero || null,
        tipo_sanguineo: data.tipo_sanguineo || null,
        alergias: data.alergias || null,
        medicamentos: data.medicamentos || null,
        deficiencias: data.deficiencias || null,
        escola: data.escola || null,
        serie: data.serie || null,
        turno: data.turno || null,
        observacoes_educacionais: data.observacoes_educacionais || null,
        nome_responsavel: data.nome_responsavel || null,
        parentesco_responsavel: data.parentesco_responsavel || null,
        cpf_responsavel: data.cpf_responsavel || null,
        telefone_responsavel: data.telefone_responsavel || null,
        endereco_responsavel: data.endereco_responsavel || null,
        data_entrada: (data as any).data_entrada === '' ? null : (data as any).data_entrada,
        motivo_acolhimento: (data as any).motivo_acolhimento || null,
        cpf: data.cpf || null,
        rg: data.rg || null,
        endereco: data.endereco || null,
        telefone: data.telefone || null,
      };

      // Validar campos obrigatórios
      if (!payload.nome) {
        throw new Error('Nome é obrigatório');
      }
      if (!payload.data_nascimento) {
        throw new Error('Data de nascimento é obrigatória');
      }
      if (!payload.abrigo_id) {
        throw new Error('Abrigo (empresa) é obrigatório. Verifique se o admin está vinculado a uma empresa.');
      }
      if (!payload.genero) {
        throw new Error('Gênero é obrigatório');
      }

      console.log('[acolhidoService] Payload final:', JSON.stringify(payload, null, 2));

      const { data: acolhido, error } = await supabase
        .from('acolhidos')
        .insert([payload])
        .select()
        .single()

      if (error) {
        console.error('[acolhidoService] Erro ao criar acolhido:', error);
        console.error('[acolhidoService] Detalhes do erro:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      if (!acolhido) {
        throw new Error('Erro ao criar acolhido: nenhum dado retornado');
      }

      console.log('[acolhidoService] ✅ Acolhido criado com sucesso:', acolhido.id);
      return acolhido;
    } catch (error) {
      console.error('[acolhidoService] Erro ao criar acolhido:', error);
      throw error;
    }
  },

  async updateAcolhido(id: string, data: UpdateAcolhidoData): Promise<Acolhido> {
    try {
      console.log('[acolhidoService] Atualizando acolhido:', id);
      // Tratamento para campos de data vazios
      const payload = {
        ...data,
        data_nascimento: data.data_nascimento === '' ? null : data.data_nascimento,
        data_entrada: (data as any).data_entrada === '' ? null : (data as any).data_entrada,
        data_inativacao: (data as any).data_inativacao === '' ? null : (data as any).data_inativacao,
      };

      const { data: acolhido, error } = await supabase
        .from('acolhidos')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

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
      const { error } = await supabase
        .from('acolhidos')
        .delete()
        .eq('id', id)

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
      const { data, error } = await supabase
        .from('acolhido_fotos')
        .select('*')
        .eq('acolhido_id', acolhidoId)
        .order('created_at', { ascending: false })

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
      const { data: foto, error } = await supabase
        .from('acolhido_fotos')
        .insert([data])
        .select()
        .single()

      if (error) {
        console.error('[acolhidoService] Erro ao criar foto:', error);
        throw error;
      }

      if (!foto) {
        throw new Error('Erro ao criar foto: nenhum dado retornado');
      }

      return foto;
    } catch (error) {
      console.error('[acolhidoService] Erro ao criar foto:', error);
      throw error;
    }
  },

  async updateAcolhidoFoto(id: string, data: UpdateAcolhidoFotoData): Promise<AcolhidoFoto> {
    try {
      console.log('[acolhidoService] Atualizando foto:', id);
      const { data: foto, error } = await supabase
        .from('acolhido_fotos')
        .update(data)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('[acolhidoService] Erro ao atualizar foto:', error);
        throw error;
      }

      if (!foto) {
        throw new Error('Erro ao atualizar foto: nenhum dado retornado');
      }

      return foto;
    } catch (error) {
      console.error('[acolhidoService] Erro ao atualizar foto:', error);
      throw error;
    }
  },

  async deleteAcolhidoFoto(id: string): Promise<void> {
    try {
      console.log('[acolhidoService] Deletando foto:', id);
      const { error } = await supabase
        .from('acolhido_fotos')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('[acolhidoService] Erro ao deletar foto:', error);
        throw error;
      }
    } catch (error) {
      console.error('[acolhidoService] Erro ao deletar foto:', error);
      throw error;
    }
  },

  // Upload de Fotos
  async uploadFoto(file: File, acolhidoId: string, tipo: 'foto_perfil' | 'foto_documento'): Promise<string> {
    try {
      console.log('[acolhidoService] Fazendo upload de foto para acolhido:', acolhidoId);
      const fileExt = file.name.split('.').pop()
      const fileName = `${acolhidoId}/${tipo}/${Math.random()}.${fileExt}`
      const filePath = `acolhidos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('acolhidos')
        .upload(filePath, file)

      if (uploadError) {
        console.error('[acolhidoService] Erro ao fazer upload da foto:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('acolhidos')
        .getPublicUrl(filePath)

      console.log('[acolhidoService] Upload de foto concluído com sucesso:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('[acolhidoService] Erro ao fazer upload da foto:', error);
      throw error;
    }
  }
} 