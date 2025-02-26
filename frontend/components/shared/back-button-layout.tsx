"use client"

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

type BackButtonLayoutProps = {
  children: React.ReactNode;
  title?: string;
  customGoBack?: () => void;
}

/**
 * BackButtonLayout - Componente layout con botón para ir hacia atrás
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del layout
 * @param {string} props.title - Título que se mostrará en el header
 * @param {Function} [props.customGoBack] - Función opcional para manejar la navegación hacia atrás
 * @returns {JSX.Element} Componente de layout
 */
const BackButtonLayout = ({ children, title, customGoBack }: BackButtonLayoutProps) => {
  const router = useRouter();

  const handleGoBack = () => {
    if (customGoBack) {
      customGoBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2 p-2" 
            onClick={handleGoBack} 
            aria-label="Volver atrás"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          {title && <h1 className="text-xl font-semibold">{title}</h1>}
        </div>
      </div>
      
      <Separator className="my-2" />
        {children}
    </div>
  );
};

export default BackButtonLayout;