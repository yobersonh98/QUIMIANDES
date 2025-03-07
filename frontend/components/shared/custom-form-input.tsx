import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';

interface CustomFormInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  description?: string;
}

export function CustomFormInput({
  control,
  name,
  label,
  placeholder = `Ingrese ${label.toLowerCase()}`,
  type = 'text',
  disabled = false,
  className = '',
  description
}: CustomFormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input 
              {...field} 
              type={type}
              placeholder={placeholder} 
              disabled={disabled}
            />
          </FormControl>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}