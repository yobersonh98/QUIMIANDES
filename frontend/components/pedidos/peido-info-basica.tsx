import React from 'react'
import { PedidoEntity } from '@/services/pedidos/entity/pedido.entity'
import { formatFecha } from '@/lib/utils'
import DynamicInfo from '../shared/dynamic-info'

type PedidoInfoBasicaProps = {
  pedido: PedidoEntity
}

export default function PedidoInfoBasica({pedido}: PedidoInfoBasicaProps) {
  const clienteItems = [
    { 
      label: 'Cliente', 
      value: pedido.cliente.nombre,
    },
    { 
      label: 'Documento', 
      value: pedido.cliente.documento 
    }
  ];

  const pedidoItems = [
    { 
      label: 'Fecha del Pedido', 
      value: pedido.fechaRecibido,
      formatFunction: formatFecha
    },
    { 
      label: 'Estado', 
      value: pedido.estado 
    },
    { 
      label: 'Orden de Compra', 
      value: pedido.ordenCompra 
    },
  ];

  return (
    <>
      <DynamicInfo 
        title="Información del Cliente" 
        items={clienteItems} 
      />
      
      <DynamicInfo 
        title="Información del Pedido" 
        items={pedidoItems} 
      />
    </>
  )
}