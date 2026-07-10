import type { Message } from '../types'
import { LoadingIndicator } from './LoadingIndicator'
import { MarkdownContent } from './MarkdownContent'

interface Props {
  message: Message
}

export function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end py-2">
        <div className="max-w-[75%] bg-gray-800 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 py-2">

      <div className="max-w-[75%] bg-gray-100 text-gray-900 rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed break-words">
        {message.content ? (
          <MarkdownContent content={message.content} />
        ) : (
          <LoadingIndicator />
        )}
      </div>
    </div>
  )
}
