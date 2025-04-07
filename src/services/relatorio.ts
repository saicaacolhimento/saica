import { supabase } from '@/config/supabase'
import { Relatorio, CreateRelatorioData, UpdateRelatorioData, RelatorioEstatistica } from '@/types/relatorio'

export const relatorioService = {
  // Relatórios
  async getRelatorios(): Promise<Relatorio[]> {
    const { data, error } = await supabase
      .from('relatorios')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getRelatorioById(id: string): Promise<Relatorio> {
    const { data, error } = await supabase
      .from('relatorios')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async createRelatorio(data: CreateRelatorioData): Promise<Relatorio> {
    const { data: relatorio, error } = await supabase
      .from('relatorios')
      .insert([{ ...data, status: 'pendente' }])
      .select()
      .single()

    if (error) throw error
    return relatorio
  },

  async updateRelatorio(id: string, data: UpdateRelatorioData): Promise<Relatorio> {
    const { data: relatorio, error } = await supabase
      .from('relatorios')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return relatorio
  },

  async deleteRelatorio(id: string): Promise<void> {
    const { error } = await supabase
      .from('relatorios')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Estatísticas
  async getEstatisticas(): Promise<RelatorioEstatistica> {
    const { data, error } = await supabase.rpc('get_relatorio_estatisticas')

    if (error) throw error
    return data
  },

  // Geração de Relatórios
  async gerarPDF(relatorioId: string): Promise<string> {
    const { data, error } = await supabase.rpc('gerar_relatorio_pdf', {
      relatorio_id: relatorioId
    })

    if (error) throw error
    return data
  },

  async gerarExcel(relatorioId: string): Promise<string> {
    const { data, error } = await supabase.rpc('gerar_relatorio_excel', {
      relatorio_id: relatorioId
    })

    if (error) throw error
    return data
  },

  async gerarCSV(relatorioId: string): Promise<string> {
    const { data, error } = await supabase.rpc('gerar_relatorio_csv', {
      relatorio_id: relatorioId
    })

    if (error) throw error
    return data
  }
} 