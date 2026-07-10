import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { ChatInput } from '../components/ChatInput'
import { ChatMessage } from '../components/ChatMessage'
import { Sidebar } from '../components/Sidebar'
import { useChat } from '../hooks/useChat'
import { useConversations } from '../hooks/useConversations'

export function RAGPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const sessionId = searchParams.get('session') ?? ''

  const {
    conversations,
    refresh,
    newConversation,
    removeConversation,
  } = useConversations()

  const {
    conversation,
    streamStatus,
    sendMessage,
  } = useChat(sessionId, refresh)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const isStreaming = streamStatus !== 'idle'
  const messages = conversation?.messages ?? []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [messages.length, streamStatus])

  function handleNew() {
    const id = newConversation()
    navigate(`/?session=${id}`)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        conversations={conversations}
        activeId={sessionId || undefined}
        onNew={handleNew}
        onDelete={removeConversation}
      />

        <main className="flex-1 min-w-0 bg-white">
          {messages.length === 0 && !isStreaming ? (
            <div className="flex min-h-full items-center justify-center">
              <p className="text-sm text-gray-400">
                Sem mensagens ainda. Diga olá!
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-200 py-2">

            </div>
          )}

          {/* Área fixa inferior */}
          <div className="sticky bottom-0 z-10">
            {/* Gradiente igual ChatGPT */}
            <div className="pointer-events-none" />

            {/* Input */}
            <div className="px-4">
              <div className="mx-auto max-w-200">
                <ChatInput
                  onSend={sendMessage}
                  disabled={isStreaming}
                />
              </div>
            </div>
          </div>
        </main>
  
    </div>
  )
}