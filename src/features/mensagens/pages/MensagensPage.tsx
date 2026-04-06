import { useState, useRef, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Search, Send, MessageSquare, User, Check, CheckCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useMensagem, useMensagensConversa } from '@/hooks/useMensagem'
import type { Conversa, ContatoInfo } from '@/types/mensagem'

export default function MensagensPage() {
  const { userId, contatos, conversas, sendMensagem, startConversa } = useMensagem()
  const [activeConversaId, setActiveConversaId] = useState<string | null>(null)
  const [activeContact, setActiveContact] = useState<ContatoInfo | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { data: mensagens, isLoading: loadingMsgs } = useMensagensConversa(activeConversaId)

  const contatosList = contatos.data || []
  const conversasList = conversas.data || []

  const conversaContactMap = useMemo(() => {
    const map: Record<string, ContatoInfo | undefined> = {}
    for (const c of conversasList) {
      const otherId = c.participante1_id === userId ? c.participante2_id : c.participante1_id
      map[c.id] = contatosList.find(ct => ct.id === otherId)
    }
    return map
  }, [conversasList, contatosList, userId])

  const filteredContatos = contatosList.filter(c =>
    c.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const conversasWithContact = conversasList
    .map(c => ({ conversa: c, contato: conversaContactMap[c.id] }))
    .filter(item => {
      if (!searchTerm) return true
      const name = item.contato?.nome?.toLowerCase() || ''
      const email = item.contato?.email?.toLowerCase() || ''
      const term = searchTerm.toLowerCase()
      return name.includes(term) || email.includes(term)
    })

  const contatosSemConversa = filteredContatos.filter(c => {
    return !conversasList.some(conv => {
      const otherId = conv.participante1_id === userId ? conv.participante2_id : conv.participante1_id
      return otherId === c.id
    })
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensagens])

  const handleSelectContact = async (contato: ContatoInfo) => {
    setActiveContact(contato)
    const existing = conversasList.find(c => {
      const otherId = c.participante1_id === userId ? c.participante2_id : c.participante1_id
      return otherId === contato.id
    })
    if (existing) {
      setActiveConversaId(existing.id)
    } else {
      const conversa = await startConversa.mutateAsync(contato.id)
      setActiveConversaId(conversa.id)
    }
  }

  const handleSelectConversa = (conversa: Conversa) => {
    setActiveConversaId(conversa.id)
    setActiveContact(conversaContactMap[conversa.id] || null)
  }

  const handleSend = async () => {
    if (!message.trim() || !activeConversaId || !activeContact) return
    const text = message.trim()
    setMessage('')
    await sendMensagem.mutateAsync({ conversaId: activeConversaId, destinatarioId: activeContact.id, conteudo: text })
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const getInitials = (nome: string) => {
    const parts = nome.split(' ')
    return (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] rounded-xl overflow-hidden border shadow-lg bg-white">
      {/* Painel esquerdo - Contatos/Conversas */}
      <div className="w-80 flex flex-col border-r bg-gray-50 shrink-0">
        <div className="p-3 border-b bg-white">
          <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            Mensagens
          </h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 text-sm bg-gray-100 border-0"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Conversas existentes */}
          {conversasWithContact.map(({ conversa, contato }) => {
            const isActive = activeConversaId === conversa.id
            return (
              <button
                key={conversa.id}
                onClick={() => handleSelectConversa(conversa)}
                className={`w-full flex items-center gap-3 px-3 py-3 border-b border-gray-100 hover:bg-gray-100 transition-colors text-left ${isActive ? 'bg-indigo-50' : ''}`}
              >
                <div className="h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold shrink-0 uppercase">
                  {contato ? getInitials(contato.nome) : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold truncate">{contato?.nome || 'Desconhecido'}</p>
                    {conversa.data_ultima_mensagem && (
                      <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                        {format(new Date(conversa.data_ultima_mensagem), 'HH:mm', { locale: ptBR })}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conversa.ultima_mensagem || 'Nenhuma mensagem'}</p>
                </div>
              </button>
            )
          })}

          {/* Contatos sem conversa */}
          {contatosSemConversa.length > 0 && (
            <>
              <div className="px-3 py-2 bg-gray-100 border-b">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contatos da empresa</p>
              </div>
              {contatosSemConversa.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelectContact(c)}
                  className="w-full flex items-center gap-3 px-3 py-3 border-b border-gray-100 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="h-10 w-10 rounded-full bg-gray-300 text-white flex items-center justify-center text-sm font-bold shrink-0 uppercase">
                    {getInitials(c.nome)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.nome}</p>
                    <p className="text-xs text-gray-400 truncate">{c.email}</p>
                  </div>
                </button>
              ))}
            </>
          )}

          {contatosList.length === 0 && !contatos.isLoading && (
            <div className="p-6 text-center text-sm text-gray-400">
              Nenhum contato encontrado na sua empresa
            </div>
          )}
        </div>
      </div>

      {/* Painel direito - Chat */}
      <div className="flex-1 flex flex-col bg-white">
        {!activeConversaId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
            <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">SAICA Mensagens</p>
            <p className="text-sm mt-1">Selecione um contato para iniciar uma conversa</p>
          </div>
        ) : (
          <>
            {/* Header do chat */}
            <div className="h-14 px-4 flex items-center gap-3 border-b bg-white shrink-0">
              <div className="h-9 w-9 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                {activeContact ? getInitials(activeContact.nome) : '?'}
              </div>
              <div>
                <p className="text-sm font-semibold">{activeContact?.nome || 'Contato'}</p>
                <p className="text-[11px] text-gray-400">{activeContact?.email}</p>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#F0F2F5]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23d1d5db\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
              {loadingMsgs ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-400">Carregando mensagens...</p>
                </div>
              ) : mensagens && mensagens.length > 0 ? (
                <div className="space-y-1.5">
                  {mensagens.map(msg => {
                    const isMine = msg.remetente_id === userId
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[65%] px-3 py-2 rounded-lg shadow-sm ${isMine ? 'bg-[#D9FDD3] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{msg.conteudo}</p>
                          <div className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-[10px] text-gray-500">
                              {format(new Date(msg.data_envio), 'HH:mm', { locale: ptBR })}
                            </span>
                            {isMine && (
                              msg.lida
                                ? <CheckCheck className="h-3 w-3 text-blue-500" />
                                : <Check className="h-3 w-3 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-400">Nenhuma mensagem ainda. Diga olá!</p>
                </div>
              )}
            </div>

            {/* Input de mensagem */}
            <div className="px-4 py-3 border-t bg-white flex items-end gap-2 shrink-0">
              <textarea
                ref={textareaRef}
                placeholder="Digite uma mensagem..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="flex-1 resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent max-h-32"
                style={{ minHeight: '40px' }}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!message.trim() || sendMensagem.isPending}
                className="h-10 w-10 rounded-full bg-indigo-600 hover:bg-indigo-700 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
