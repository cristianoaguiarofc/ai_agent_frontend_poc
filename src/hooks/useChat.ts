import { useState, useCallback, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Conversation, Message } from '../types'
import {
  getConversation,
  createConversation,
  appendMessage,
  updateLastAssistantMessage,
} from '../services/conversationService'
import { streamMessage } from '../services/chatService'

type StreamStatus = 'idle' | 'waiting' | 'streaming'

export function useChat(sessionId: string, onConversationUpdate?: () => void) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [streamStatus, setStreamStatus] = useState<StreamStatus>('idle')
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    let conv = getConversation(sessionId)
    if (!conv) {
      conv = createConversation(sessionId)
    }
    setConversation(conv)
    setStreamStatus('idle')
  }, [sessionId])

  const sendMessage = useCallback(
    (content: string) => {
      if (streamStatus !== 'idle' || !content.trim()) return

      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content: content.trim(),
        createdAt: Date.now(),
      }

      let updated = appendMessage(sessionId, userMessage)
      if (updated) {
        setConversation({ ...updated })
        onConversationUpdate?.()
      }

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '',
        createdAt: Date.now(),
      }

      updated = appendMessage(sessionId, assistantMessage)
      if (updated) setConversation({ ...updated })

      setStreamStatus('waiting')

      abortRef.current = streamMessage(sessionId, content.trim(), {
        onToken: (token) => {
          setStreamStatus('streaming')
          const conv = getConversation(sessionId)
          if (!conv) return
          const lastMsg = conv.messages[conv.messages.length - 1]
          if (lastMsg?.role !== 'assistant') return
          const newContent = lastMsg.content + token
          const result = updateLastAssistantMessage(sessionId, newContent)
          if (result) setConversation({ ...result })
        },
        onDone: () => {
          setStreamStatus('idle')
          abortRef.current = null
          onConversationUpdate?.()
        },
        onError: () => {
          setStreamStatus('idle')
          abortRef.current = null
        },
      })
    },
    [sessionId, streamStatus, onConversationUpdate],
  )

  const abort = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setStreamStatus('idle')
  }, [])

  return { conversation, streamStatus, sendMessage, abort }
}
