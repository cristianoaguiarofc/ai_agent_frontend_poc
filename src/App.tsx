import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChatPage } from './pages/ChatPage'
import { RAGPage } from './pages/RAGPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route path="/rag" element={<RAGPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
