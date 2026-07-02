import type { Message } from '../types'
import { MarkdownContent } from './MarkdownContent'

interface Props {
  message: Message
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-2">
        <div className="max-w-[75%] bg-indigo-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 px-4 py-2">
      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-white text-xs font-bold">IA</span>
      </div>
      <div className="max-w-[75%] bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed break-words">
        {message.content
          ? <MarkdownContent content={message.content} />
          : <span className="opacity-40">...</span>
        }
      </div>
    </div>
  )
}
