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

        <main className="flex w-full flex-col h-dvh overflow-auto">
          <div className='max-w-200 mx-auto w-full h-full flex flex-col'>

              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-gray-400">
                  Sem mensagens ainda. Diga olá!
                </p>
              </div>

            {/* input sticky com margin negativo pra sobrepor sem reservar espaço */}
            <div className="sticky bottom-0 z-20 mt-auto">
              <ChatInput onSend={sendMessage} disabled={isStreaming} />
            </div>
          </div>
        </main>
  
    </div>
  )
}