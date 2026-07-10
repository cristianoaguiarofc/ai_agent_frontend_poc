import { useState, useRef, type KeyboardEvent } from 'react'

interface Props {
  onSend: (message: string) => void
  disabled: boolean
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSend() {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInput() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className='flex flex-col w-full max-w-200'>

      <div className="relative w-full max-w-200">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white -z-10" />
        <div className="flex items-end gap-2 bg-gray-100 rounded-4xl px-4 py-4">
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            disabled={disabled}
            placeholder={disabled ? 'Aguardando resposta...' : 'Digite uma mensagem...'}
            className="flex-1 resize-none bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400 disabled:cursor-not-allowed py-1 max-h-40 leading-relaxed"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center shrink-0 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800 hover:cursor-pointer"
            aria-label="Enviar mensagem"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-white"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 py-2 bg-white">
        Enter para enviar · Shift+Enter para nova linha
      </p>
    </div>
  )
}
