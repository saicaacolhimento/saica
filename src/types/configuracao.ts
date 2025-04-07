export interface Configuracao {
  id: string
  chave: string
  valor: string
  descricao: string
  tipo: 'texto' | 'numero' | 'booleano' | 'json' | 'senha'
  categoria: 'geral' | 'email' | 'sms' | 'whatsapp' | 'backup' | 'seguranca'
  obrigatorio: boolean
  created_at: string
  updated_at: string
}

export interface CreateConfiguracaoData {
  chave: string
  valor: string
  descricao: string
  tipo: Configuracao['tipo']
  categoria: Configuracao['categoria']
  obrigatorio: boolean
}

export interface UpdateConfiguracaoData {
  valor?: string
  descricao?: string
  tipo?: Configuracao['tipo']
  categoria?: Configuracao['categoria']
  obrigatorio?: boolean
}

export interface BackupConfig {
  id: string
  data: string
  tipo: 'completo' | 'parcial'
  status: 'pendente' | 'processando' | 'concluido' | 'erro'
  url_download?: string
  erro?: string
  created_at: string
  updated_at: string
}

export interface CreateBackupConfig {
  tipo: BackupConfig['tipo']
}

export interface UpdateBackupConfig {
  status?: BackupConfig['status']
  url_download?: string
  erro?: string
}

export interface EmailConfig {
  host: string
  port: number
  user: string
  password: string
  from: string
  secure: boolean
}

export interface SMSConfig {
  provider: string
  api_key: string
  api_secret: string
  from: string
}

export interface WhatsAppConfig {
  provider: string
  api_key: string
  api_secret: string
  phone_number: string
}

export interface SecurityConfig {
  session_timeout: number
  max_login_attempts: number
  password_min_length: number
  require_special_chars: boolean
  require_numbers: boolean
  require_uppercase: boolean
  require_lowercase: boolean
} 