import React from 'react'
import { PedidoEntity } from '@/services/pedidos/entity/pedido.entity'
import { formatFecha } from '@/lib/utils'
import DynamicInfo from '../shared/dynamic-info'
import { DocumentosLista } from '../shared/documentos-lista'
import EstadoBadge from '../shared/estado-badge'

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
      value: <EstadoBadge estado={pedido.estado}/>
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
      <DocumentosLista 
        titulo='Adjuntos'
        documentos={pedido.pedidoDocumentos?.map(i=>i.documento) || []}
      />
    </>
  )
}