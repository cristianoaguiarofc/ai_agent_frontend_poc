import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { ChatMessage } from '../components/ChatMessage'
import { ChatInput } from '../components/ChatInput'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { useConversations } from '../hooks/useConversations'
import { useChat } from '../hooks/useChat'

export function ChatPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const sessionId = searchParams.get('session') ?? ''

  const { conversations, refresh, newConversation, removeConversation } = useConversations()
  const { conversation, streamStatus, sendMessage } = useChat(sessionId, refresh)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages.length, streamStatus])

  function handleNew() {
    const id = newConversation()
    navigate(`/?session=${id}`)
  }

  const isStreaming = streamStatus !== 'idle'
  const messages = conversation?.messages ?? []

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={sessionId || undefined}
        onNew={handleNew}
        onDelete={removeConversation}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {!sessionId ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                IA Agent Chat
              </h1>
              <p className="text-gray-400 text-sm">
                Selecione uma conversa ou inicie uma nova.
              </p>
            </div>
            <button
              type="button"
              onClick={handleNew}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 px-6 text-sm font-medium transition-colors"
            >
              Iniciar conversa
            </button>
          </div>
        ) : (
          <>
            <header className="border-b border-gray-200 px-6 py-3 bg-white">
              <h2 className="text-sm font-medium text-gray-900 truncate">
                {conversation?.title ?? 'Nova conversa'}
              </h2>
              <p className="text-xs text-gray-400 font-mono truncate mt-0.5">
                {sessionId}
              </p>
            </header>

            <div className="flex-1 overflow-y-auto py-4 space-y-1 bg-white">
              {messages.length === 0 && !isStreaming && (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-8">
                  <p className="text-gray-400 text-sm">
                    Sem mensagens ainda. Diga olá!
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {streamStatus === 'waiting' && <LoadingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            <ChatInput onSend={sendMessage} disabled={isStreaming} />
          </>
        )}
      </main>
    </div>
  )
}
