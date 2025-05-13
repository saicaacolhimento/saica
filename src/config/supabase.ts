import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variáveis de ambiente do Supabase não configuradas')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'saica-auth-token',
    storage: {
      getItem: (key) => {
        try {
          console.log('[Supabase Storage] Tentando ler do localStorage:', key);
          const value = localStorage.getItem(key)
          console.log('[Supabase Storage] Valor encontrado:', value ? 'presente' : 'ausente');
          return value ? JSON.parse(value) : null
        } catch (error) {
          console.error('[Supabase Storage] Erro ao ler do localStorage:', error)
          return null
        }
      },
      setItem: (key, value) => {
        try {
          console.log('[Supabase Storage] Tentando escrever no localStorage:', {
            key,
            value: value ? 'presente' : 'ausente'
          });
          localStorage.setItem(key, JSON.stringify(value))
          console.log('[Supabase Storage] Escrita realizada com sucesso');
        } catch (error) {
          console.error('[Supabase Storage] Erro ao escrever no localStorage:', error)
        }
      },
      removeItem: (key) => {
        try {
          console.log('[Supabase Storage] Tentando remover do localStorage:', key);
          localStorage.removeItem(key)
          console.log('[Supabase Storage] Remoção realizada com sucesso');
        } catch (error) {
          console.error('[Supabase Storage] Erro ao remover do localStorage:', error)
        }
      }
    }
  }
})

// Expor supabase no window para debug
if (typeof window !== 'undefined') {
  window.supabase = supabase;
} 