import React, { useEffect } from 'react';
import { format, Locale } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Control, useFormContext } from 'react-hook-form';

interface CustomFormDatePickerProps {
  //
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  defaultValue?: Date;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  description?: string;
  locale?: Locale;
  dateFormat?: string;
  withTime?: boolean; // Nueva prop para habilitar selección de hora
}

export function CustomFormDatePicker({
  control,
  name,
  label,
  defaultValue,
  placeholder = "Seleccione una fecha",
  disabled = false,
  className = "",
  description,
  locale = es,
  dateFormat = "PPP",
  withTime = false,
}: CustomFormDatePickerProps) {
  // Acceder al contexto del formulario para poder establecer valores
  const formContext = useFormContext();
  
  // Establecer el valor predeterminado si se proporciona y no hay un valor existente
  useEffect(() => {
    if (defaultValue && formContext) {
      const currentValue = formContext.getValues(name);
      if (!currentValue) {
        // Asegurarse de que defaultValue sea una instancia de Date
        const defaultDate = defaultValue instanceof Date ? defaultValue : new Date(defaultValue);
        formContext.setValue(name, defaultDate);
      }
    }
  }, [defaultValue, formContext, name]);

  // Función para manejar cambios de hora
  const handleTimeChange = (value: Date | undefined, timeString: string) => {
    if (!value || !timeString) return value;
    
    try {
      // Extraer horas y minutos del string
      const [hours, minutes] = timeString.split(':').map(Number);
      
      // Validar que sean números válidos
      if (isNaN(hours) || isNaN(minutes)) return value;
      
      // Establecer la hora y minutos en la fecha
      const newDate = new Date(value);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      
      return newDate;
    } catch (error) {
      console.error("Error al procesar la hora:", error);
      return value;
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Asegurarse de que field.value sea una instancia de Date si existe
        const fieldValue = field.value ? (field.value instanceof Date ? field.value : new Date(field.value)) : undefined;
        
        return (
          <FormItem className={cn( className)}>
            <FormLabel>{label}</FormLabel>
            <div className={cn("flex gap-2", withTime ? "flex-col sm:flex-row" : "")}>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal", 
                        !fieldValue && "text-muted-foreground",
                        withTime && "sm:w-[70%]"
                      )}
                      disabled={disabled}
                    >
                      {fieldValue ? (
                        format(fieldValue, dateFormat, { locale })
                      ) : (
                        <span>{placeholder}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar 
                    mode="single" 
                    selected={fieldValue} 
                    onSelect={field.onChange} 
                    locale={locale} 
                    disabled={disabled}
                  />
                </PopoverContent>
              </Popover>
              
              {withTime && (
                <div className={cn("flex items-center gap-2", "sm:w-[30%]")}>
                  <FormControl>
                    <div className="relative w-full flex items-center">
                      <Input
                        type="time"
                        className="pl-8"
                        value={fieldValue ? format(fieldValue, "HH:mm") : ""}
                        onChange={(e) => {
                          const newDate = handleTimeChange(fieldValue || new Date(), e.target.value);
                          field.onChange(newDate);
                        }}
                        disabled={disabled || !fieldValue}
                      />
                      <Clock className="absolute left-2 h-4 w-4 opacity-50" />
                    </div>
                  </FormControl>
                </div>
              )}
            </div>
            
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}