
import React from 'react';
import ReactDOM from 'react-dom/client';
// Importa o componente principal da aplicação.
import App from './App';

// Encontra o elemento 'root' no HTML para montar a aplicação React.
const rootElement = document.getElementById('root');
if (!rootElement) {
  // Lança um erro se o elemento 'root' não for encontrado.
  throw new Error("Could not find root element to mount to");
}

// Cria a raiz da aplicação React no elemento 'root'.
const root = ReactDOM.createRoot(rootElement);
// Renderiza o componente App dentro do StrictMode do React para ajudar a encontrar problemas potenciais.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);