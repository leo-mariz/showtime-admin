import React from 'react';

interface PageProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

/**
 * Componente auxiliar para definir metadados da página
 * Use dentro de páginas que estão renderizadas dentro do AdminLayout
 */
export const Page = ({ children, title, subtitle, icon }: PageProps) => {
  // Armazena os metadados em um contexto ou custom event
  React.useEffect(() => {
    const event = new CustomEvent('page-metadata', {
      detail: { title, subtitle, icon }
    });
    window.dispatchEvent(event);

    return () => {
      // Limpa ao desmontar
      const clearEvent = new CustomEvent('page-metadata', {
        detail: { title: undefined, subtitle: undefined, icon: undefined }
      });
      window.dispatchEvent(clearEvent);
    };
  }, [title, subtitle, icon]);

  return <>{children}</>;
};

