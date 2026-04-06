import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { mensagemService } from '@/services/mensagem'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/config/supabase'

export function useMensagem() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id || ''
  const empresaId = (user as any)?.empresa_id || null
  const isMaster = (user as any)?.role === 'master'

  const contatos = useQuery({
    queryKey: ['contatos-mensagens', empresaId, isMaster],
    queryFn: () => mensagemService.getContatos(empresaId, userId, isMaster),
    enabled: !!userId && (!!empresaId || isMaster),
  })

  const conversas = useQuery({
    queryKey: ['conversas', userId],
    queryFn: () => mensagemService.getConversas(userId),
    enabled: !!userId,
    refetchInterval: 10000,
  })

  const unreadCount = useQuery({
    queryKey: ['unread-count', userId],
    queryFn: () => mensagemService.getUnreadCount(userId),
    enabled: !!userId,
    refetchInterval: 15000,
  })

  const sendMensagem = useMutation({
    mutationFn: (params: { conversaId: string; destinatarioId: string; conteudo: string }) =>
      mensagemService.sendMensagem(params.conversaId, userId, params.destinatarioId, params.conteudo),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ['mensagens', vars.conversaId] })
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    },
  })

  const startConversa = useMutation({
    mutationFn: (otherUserId: string) => mensagemService.getOrCreateConversa(userId, otherUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
    },
  })

  return {
    userId,
    contatos,
    conversas,
    unreadCount,
    sendMensagem,
    startConversa,
  }
}

export function useMensagensConversa(conversaId: string | null) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id || ''

  const mensagens = useQuery({
    queryKey: ['mensagens', conversaId],
    queryFn: () => mensagemService.getMensagens(conversaId!),
    enabled: !!conversaId,
    refetchInterval: 5000,
  })

  useEffect(() => {
    if (!conversaId) return

    const channel = supabase
      .channel(`mensagens:${conversaId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens', filter: `conversa_id=eq.${conversaId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ['mensagens', conversaId] })
        queryClient.invalidateQueries({ queryKey: ['conversas'] })
        queryClient.invalidateQueries({ queryKey: ['unread-count'] })
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [conversaId, queryClient])

  useEffect(() => {
    if (!conversaId || !userId) return
    mensagemService.marcarComoLida(conversaId, userId).then(() => {
      queryClient.invalidateQueries({ queryKey: ['unread-count'] })
    })
  }, [conversaId, userId, mensagens.data, queryClient])

  return mensagens
}
