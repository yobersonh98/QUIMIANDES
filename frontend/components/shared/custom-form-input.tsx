import React from 'react';
import { 
  FormField, 
  FormItem, 
  FormControl, 
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Control } from 'react-hook-form';
import { Label } from '../ui/label';

interface CustomFormInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  description?: string;
  required?:boolean
}

export function CustomFormInput({
  control,
  name,
  label,
  placeholder = `Ingrese ${label.toLowerCase()}`,
  type = 'text',
  disabled = false,
  className = '',
  description,
  required
}: CustomFormInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <Label required={required}>{label}</Label>
          <FormControl>
            <Input 
              {...field} 
              type={type}
              placeholder={placeholder} 
              disabled={disabled}
            />
          </FormControl>
          {description && (
            <p className="text-sm ">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}