import type { Conversation, Message } from '../types'

const STORAGE_KEY = 'ia_agent_conversations'

export function getConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getConversation(id: string): Conversation | undefined {
  return getConversations().find((c) => c.id === id)
}

export function saveConversation(conversation: Conversation): void {
  const all = getConversations().filter((c) => c.id !== conversation.id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify([conversation, ...all]))
}

export function createConversation(id: string): Conversation {
  const conversation: Conversation = {
    id,
    title: 'Nova conversa',
    createdAt: Date.now(),
    messages: [],
  }
  saveConversation(conversation)
  return conversation
}

export function appendMessage(conversationId: string, message: Message): Conversation | null {
  const conversation = getConversation(conversationId)
  if (!conversation) return null

  const updated: Conversation = {
    ...conversation,
    title: conversation.messages.length === 0 && message.role === 'user'
      ? message.content.slice(0, 40)
      : conversation.title,
    messages: [...conversation.messages, message],
  }
  saveConversation(updated)
  return updated
}

export function updateLastAssistantMessage(conversationId: string, content: string): Conversation | null {
  const conversation = getConversation(conversationId)
  if (!conversation) return null

  const messages = [...conversation.messages]
  const lastIdx = messages.length - 1
  if (lastIdx < 0 || messages[lastIdx].role !== 'assistant') return null

  messages[lastIdx] = { ...messages[lastIdx], content }
  const updated = { ...conversation, messages }
  saveConversation(updated)
  return updated
}

export function deleteConversation(id: string): void {
  const all = getConversations().filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
