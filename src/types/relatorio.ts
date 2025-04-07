export interface Relatorio {
  id: string
  titulo: string
  descricao: string
  tipo: 'acolhidos' | 'agendamentos' | 'documentos' | 'notificacoes' | 'mensagens'
  parametros: Record<string, any>
  data_inicio: string
  data_fim: string
  formato: 'pdf' | 'excel' | 'csv'
  status: 'pendente' | 'processando' | 'concluido' | 'erro'
  url_download?: string
  erro?: string
  created_at: string
  updated_at: string
}

export interface CreateRelatorioData {
  titulo: string
  descricao: string
  tipo: Relatorio['tipo']
  parametros: Record<string, any>
  data_inicio: string
  data_fim: string
  formato: Relatorio['formato']
}

export interface UpdateRelatorioData {
  titulo?: string
  descricao?: string
  tipo?: Relatorio['tipo']
  parametros?: Record<string, any>
  data_inicio?: string
  data_fim?: string
  formato?: Relatorio['formato']
  status?: Relatorio['status']
  url_download?: string
  erro?: string
}

export interface RelatorioEstatistica {
  total_acolhidos: number
  total_agendamentos: number
  total_documentos: number
  total_notificacoes: number
  total_mensagens: number
  acolhidos_por_mes: Array<{
    mes: string
    total: number
  }>
  agendamentos_por_status: Array<{
    status: string
    total: number
  }>
  documentos_por_categoria: Array<{
    categoria: string
    total: number
  }>
  notificacoes_por_tipo: Array<{
    tipo: string
    total: number
  }>
  mensagens_por_dia: Array<{
    dia: string
    total: number
  }>
} 