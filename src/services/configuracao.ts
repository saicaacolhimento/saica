import { supabase } from '@/config/supabase'
import {
  Configuracao,
  CreateConfiguracaoData,
  UpdateConfiguracaoData,
  BackupConfig,
  CreateBackupConfig,
  UpdateBackupConfig,
  EmailConfig,
  SMSConfig,
  WhatsAppConfig,
  SecurityConfig
} from '@/types/configuracao'

export const configuracaoService = {
  // Configurações Gerais
  async getConfiguracoes(): Promise<Configuracao[]> {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .order('categoria', { ascending: true })

    if (error) throw error
    return data
  },

  async getConfiguracaoById(id: string): Promise<Configuracao> {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async getConfiguracaoByChave(chave: string): Promise<Configuracao> {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('*')
      .eq('chave', chave)
      .single()

    if (error) throw error
    return data
  },

  async createConfiguracao(data: CreateConfiguracaoData): Promise<Configuracao> {
    const { data: configuracao, error } = await supabase
      .from('configuracoes')
      .insert([data])
      .select()
      .single()

    if (error) throw error
    return configuracao
  },

  async updateConfiguracao(id: string, data: UpdateConfiguracaoData): Promise<Configuracao> {
    const { data: configuracao, error } = await supabase
      .from('configuracoes')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return configuracao
  },

  async deleteConfiguracao(id: string): Promise<void> {
    const { error } = await supabase
      .from('configuracoes')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Backup
  async getBackups(): Promise<BackupConfig[]> {
    const { data, error } = await supabase
      .from('backups')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getBackupById(id: string): Promise<BackupConfig> {
    const { data, error } = await supabase
      .from('backups')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async createBackup(data: CreateBackupConfig): Promise<BackupConfig> {
    const { data: backup, error } = await supabase
      .from('backups')
      .insert([{ ...data, status: 'pendente', data: new Date().toISOString() }])
      .select()
      .single()

    if (error) throw error
    return backup
  },

  async updateBackup(id: string, data: UpdateBackupConfig): Promise<BackupConfig> {
    const { data: backup, error } = await supabase
      .from('backups')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return backup
  },

  async deleteBackup(id: string): Promise<void> {
    const { error } = await supabase
      .from('backups')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Configurações Específicas
  async getEmailConfig(): Promise<EmailConfig> {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('categoria', 'email')
      .single()

    if (error) throw error
    return JSON.parse(data.valor)
  },

  async getSMSConfig(): Promise<SMSConfig> {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('categoria', 'sms')
      .single()

    if (error) throw error
    return JSON.parse(data.valor)
  },

  async getWhatsAppConfig(): Promise<WhatsAppConfig> {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('categoria', 'whatsapp')
      .single()

    if (error) throw error
    return JSON.parse(data.valor)
  },

  async getSecurityConfig(): Promise<SecurityConfig> {
    const { data, error } = await supabase
      .from('configuracoes')
      .select('valor')
      .eq('categoria', 'seguranca')
      .single()

    if (error) throw error
    return JSON.parse(data.valor)
  },

  // Funções de Backup
  async gerarBackup(tipo: 'completo' | 'parcial'): Promise<BackupConfig> {
    const { data, error } = await supabase.rpc('gerar_backup', {
      tipo_backup: tipo
    })

    if (error) throw error
    return data
  },

  async restaurarBackup(backupId: string): Promise<void> {
    const { error } = await supabase.rpc('restaurar_backup', {
      backup_id: backupId
    })

    if (error) throw error
  }
} 