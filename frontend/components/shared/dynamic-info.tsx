import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { cn } from '@/lib/utils'

// Definición de tipos para mayor tipado
interface DynamicInfoItem {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  cols?: number;
  mdCols?: number;
  lgCols?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatFunction?: (value: any) => React.ReactNode;
}

interface DynamicInfoProps {
  title: string;
  items: DynamicInfoItem[];
  className?: string;
}

export default function DynamicInfo({ 
  title, 
  items, 
  className 
}: DynamicInfoProps) {
  // Función para renderizar cada item
  const renderInfoItem = (item: DynamicInfoItem) => {
    // Determinar valor a mostrar
    const displayValue = item.formatFunction 
      ? item.formatFunction(item.value) 
      : item.value;

    // Configuración de columnas con valores por defecto
    const colClasses = cn(
      'flex-1',
      // Columnas por defecto
      item.cols ? `col-span-${item.cols}` : 'col-span-4',
      // Columnas para dispositivos medianos
      item.mdCols ? `md:col-span-${item.mdCols}` : `md:col-span-${item.cols || 4}`,
      // Columnas para dispositivos grandes
      item.lgCols ? `lg:col-span-${item.lgCols}` : `lg:col-span-${item.mdCols || item.cols || 4}`
    );

    return (
      <div key={item.label} className={colClasses}>
        <div className="text-sm font-medium text-muted-foreground">
          {item.label}
        </div>
        <div>{displayValue}</div>
      </div>
    );
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-4">
          {items.map(renderInfoItem)}
        </div>
      </CardContent>
    </Card>
  );
}