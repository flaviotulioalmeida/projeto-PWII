
import React from 'react';

// Define as propriedades para o componente Icon, estendendo as propriedades SVG padrão.
interface IconProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode; // Os elementos filhos do SVG (ex: <path>, <circle>).
}

/**
 * Componente genérico para renderizar ícones SVG.
 * Facilita a aplicação de estilos e propriedades padrão a todos os ícones.
 */
const Icon: React.FC<IconProps> = ({ children, className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className} // Permite classes CSS customizadas.
      {...props} // Passa quaisquer outras propriedades SVG.
    >
      {children}
    </svg>
  );
};

export default Icon;