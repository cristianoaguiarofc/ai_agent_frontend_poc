import { useState, useEffect } from "react";

export function LoadingIndicator() {
  const phrases = [
    "Aguenta um minuto aí meu chapa...",
    "Pensando...",
    "Vai queimar o núcleo da CPU aqui..."
  ];

  // Começa com a primeira frase
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Sorteia um índice aleatório da lista de frases
      const randomIndex = Math.floor(Math.random() * phrases.length);
      setCurrentPhrase(phrases[randomIndex]);
    }, 6000); // 6000ms = 6 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-3 px-4 py-3">
        <span className="ml-12 shimmer-text text-gray-300 text-sm font-medium transition-all duration-500">
          {currentPhrase}
        </span>
    </div>
  );
}