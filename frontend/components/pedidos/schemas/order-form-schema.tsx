import * as z from "zod";

export const OrderFormSchema = z.object({
  idCliente: z.string({
    required_error: "Por favor seleccione un cliente",
  }),
  fechaRecibido: z.date({
    required_error: "Por favor seleccione la fecha del pedido",
  }),
  fechaEntregaGlobal: z.date().optional(),
  tipoEntregaGlobal: z.string().optional(),
  lugarEntregaGlobal: z.string(),
  estado: z.string({
    required_error: "Por favor seleccione un estado",
  }),
  ordenCompra: z.string().optional(),
  observaciones: z.string().optional(),
  detallesPedido: z
    .array(
      z.object({
        id: z.string().optional(),
        productoId: z.string({
          required_error: "Por favor seleccione un producto",
        }),
        cantidad: z.string({
          required_error: "La cantidad es requerida",
        }).refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
          message: "La cantidad debe ser un número válido mayor a 0"
        }),
        fechaEntrega: z.date({
          required_error: "Por favor seleccione una fecha de requerimiento",
        }),
        tipoEntrega: z.string({
          required_error: "Por favor seleccione el tipo de entrega",
        }),
        lugarEntregaId: z.string().optional(),
        pesoTotal: z.number({
          required_error: "El peso total es requerido",
        }).min(0, "El peso total no puede ser negativo")
      })
    )
    .min(1, "Debe agregar al menos un producto"),
});

export type OrderFormValues = z.infer<typeof OrderFormSchema>;