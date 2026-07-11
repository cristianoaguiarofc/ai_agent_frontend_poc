import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { ChatInput } from '../components/ChatInput'
import { ChatMessage } from '../components/ChatMessage'
import { Sidebar } from '../components/Sidebar'
import { useChat } from '../hooks/useChat'
import { useConversations } from '../hooks/useConversations'

export function ChatPage() {
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

  const handleNew = () => {
    const id = newConversation()
    navigate(`/?session=${id}`)
  }

  return (
    <div className="flex overflow-hidden bg-white">
      <Sidebar
        conversations={conversations}
        activeId={sessionId || undefined}
        onNew={handleNew}
        onDelete={removeConversation}
      />

      {!sessionId ? (
        <main className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-8 w-8 text-white"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z"
              />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-gray-900">
            IA Agent Chat
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Selecione uma conversa ou inicie uma nova.
          </p>

          <button
            type="button"
            onClick={handleNew}
            className="mt-6 rounded-xl bg-gray-700 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 hover:cursor-pointer"
          >
            Iniciar conversa
          </button>
        </main>
      ) : (
        <main className="flex w-full flex-col h-dvh overflow-auto">
          <div className='max-w-200 mx-auto w-full h-full flex flex-col'>

            {messages.length === 0 && !isStreaming ? (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-gray-400">
                  Sem mensagens ainda. Diga olá!
                </p>
              </div>
            ) : (

              <div className="py-2">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            <div className="sticky bottom-0 z-20 mt-auto">
              <ChatInput onSend={sendMessage} disabled={isStreaming} />
            </div>
          </div>
        </main>
      )}
    </div>
  )
}