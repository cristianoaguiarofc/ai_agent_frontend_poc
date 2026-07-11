import { useNavigate } from 'react-router-dom'
import type { Conversation } from '../types'

interface Props {
  conversations: Conversation[]
  activeId: string | undefined
  onNew: () => void
  onDelete: (id: string) => void
}

export function Sidebar({ conversations, activeId, onNew, onDelete }: Props) {
  const navigate = useNavigate()

  function handleSelect(id: string) {
    navigate(`/?session=${id}`)
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    onDelete(id)
    if (id === activeId) {
      navigate('/')
    }
  }

  return (
    <aside className="w-60 shrink-0 flex flex-col bg-gray-50 border-r border-gray-200 h-screen overflow-hidden">
      <div className="p-3 flex flex-col gap-3 border-b border-gray-200">
        <button
          type="button"
          onClick={onNew}
          className="w-full flex items-center gap-2 justify-center bg-gray-700 hover:bg-gray-800 hover:cursor-pointer transition-colors text-white rounded-xl py-2.5 px-4 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
            <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
          </svg>
          Nova conversa
        </button>
        
        <button
          type="button"
          onClick={() => navigate('/rag')}
          className="text-center bg-gray-200 text-gray-700 hover:bg-gray-800 hover:text-white hover:cursor-pointer transition-colors rounded-xl py-2.5 px-4 text-sm font-medium truncate"
        >
          Retrieval-Augmented Generation
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2">
        {conversations.length === 0 && (
          <p className="text-gray-400 text-xs text-center mt-8 px-2">
            Nenhuma conversa ainda.<br />Clique em "Nova conversa".
          </p>
        )}
        {conversations.map((conv) => {
          const isActive = conv.id === activeId
          return (
            <button
              key={conv.id}
              type="button"
              onClick={() => handleSelect(conv.id)}
              className={`w-full text-left group flex items-center gap-2 px-2 py-2 rounded-lg transition-colors text-sm mb-0.5 hover:cursor-pointer ${
                isActive
                  ? 'bg-gray-50 text-gray-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0 opacity-50">
                <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
              </svg>
              <span className="flex-1 truncate min-w-0">{conv.title}</span>
              <button
                type="button"
                onClick={(e) => handleDelete(e, conv.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:text-red-500 hover:cursor-pointer shrink-0"
                aria-label="Deletar conversa"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
                </svg>
              </button>
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-gray-200">
        <p className="text-gray-400 text-xs text-center truncate">IA Agent Chat</p>
      </div>
    </aside>
  )
}
