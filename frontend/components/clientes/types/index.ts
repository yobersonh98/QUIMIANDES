import { z } from 'zod'
import { clientFormSchema, deliveryLocationSchema } from '../schemas';
import { ClienteEntity } from '@/services/clientes/entities/cliente.entity';

export type ClientFormValues = z.infer<typeof clientFormSchema>
export type DeliveryLocation = z.infer<typeof deliveryLocationSchema>

export interface EditClientFormProps {
  clientId: string;
  initialData: ClienteEntity;
}