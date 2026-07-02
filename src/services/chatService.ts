const AI_BASE_URL = 'http://localhost:8080/chat'

export interface StreamCallbacks {
  onToken: (token: string) => void
  onDone: () => void
  onError: (error: Error) => void
}

export function streamMessage(
  sessionId: string,
  userMessage: string,
  callbacks: StreamCallbacks,
): AbortController {
  const controller = new AbortController()

  async function run() {
    try {
      const params = new URLSearchParams({ command: userMessage, sessionId })
      const response = await fetch(`${AI_BASE_URL}?${params.toString()}`, {
        method: 'GET',
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      if (!response.body) {
        throw new Error('Response body is empty')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          console.debug('[SSE raw line]', JSON.stringify(line))

          if (line.startsWith('data:')) {
            const data = line.slice(5)

            if (data.trimEnd() === '[DONE]') {
              callbacks.onDone()
              return
            }

            // Empty data field represents a newline in the streamed content
            if (data === '') {
              callbacks.onToken('\n')
              continue
            }

            try {
              const parsed = JSON.parse(data)
              if (parsed !== null && typeof parsed === 'object') {
                const token =
                  parsed?.choices?.[0]?.delta?.content ??
                  parsed?.content ??
                  null
                if (typeof token === 'string') {
                  callbacks.onToken(token)
                }
              } else {
                callbacks.onToken(data)
              }
            } catch {
              callbacks.onToken(data)
            }
          }
        }
      }

      callbacks.onDone()
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        callbacks.onError(err instanceof Error ? err : new Error(String(err)))
      }
    }
  }

  run()
  return controller
}
