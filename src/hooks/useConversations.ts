import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Conversation } from '../types'
import {
  getConversations,
  createConversation,
  deleteConversation,
} from '../services/conversationService'

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(() => getConversations())

  const refresh = useCallback(() => {
    setConversations(getConversations())
  }, [])

  const newConversation = useCallback((): string => {
    const id = uuidv4()
    createConversation(id)
    setConversations(getConversations())
    return id
  }, [])

  const removeConversation = useCallback((id: string) => {
    deleteConversation(id)
    setConversations(getConversations())
  }, [])

  return { conversations, refresh, newConversation, removeConversation }
}
