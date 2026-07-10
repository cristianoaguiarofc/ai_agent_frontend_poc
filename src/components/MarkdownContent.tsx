import { createContext, useContext } from 'react'
import type { ComponentPropsWithRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const BlockCodeCtx = createContext(false)

function Code({ className, children }: ComponentPropsWithRef<'code'>) {
  const isBlock = useContext(BlockCodeCtx)
  return isBlock ? (
    <code className="block">{children}</code>
  ) : (
    <code className="bg-gray-200 rounded px-1 py-0.5 font-mono text-xs">
      {children}
    </code>
  )
}

interface Props {
  content: string
}

export function MarkdownContent({ content }: Props) {
  const normalizedContent = content.replace(
    /(\|.*\|)\n\s*\n(?=\|)/g,
    '$1\n'
  )
  return (
    <div className="prose prose-sm max-w-none prose-slate">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside pl-5 mb-3 space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside pl-5 mb-3 space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),
          del: ({ children }) => (
            <del className="line-through opacity-70">{children}</del>
          ),
          pre: ({ children }) => (
            <BlockCodeCtx.Provider value={true}>
              <pre className="bg-gray-200 rounded-lg p-3 mb-3 overflow-x-auto font-mono text-xs leading-relaxed">
                {children}
              </pre>
            </BlockCodeCtx.Provider>
          ),
          code: Code,
          h1: ({ children }) => (
            <h1 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm font-bold mb-2 mt-3 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold mb-1.5 mt-2 first:mt-0">{children}</h3>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline underline-offset-2"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-gray-300 pl-3 mb-3 text-gray-500 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-gray-200 my-3" />,
          table: ({ children }) => (
            <div className="not-prose my-6 overflow-x-auto">
              <table
                className="w-full overflow-hidden rounded-md bg-white shadow-md text-sm"
              >
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-gray-800 text-white">
              {children}
            </thead>
          ),

          tbody: ({ children }) => (
            <tbody>
              {children}
            </tbody>
          ),

          tr: ({ children }) => (
            <tr>
              {children}
            </tr>
          ),

          th: ({ children, align }) => (
            <th
              className="text-left px-5 py-3 font-semibold border-b border-slate-200"
            >
              {children}
            </th>
          ),

          td: ({ children, align }) => (
            <td
              className="text-left px-5 py-3 text-slate-700 border-b border-slate-200"
            >
              {children}
            </td>
          ),
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  )
}
