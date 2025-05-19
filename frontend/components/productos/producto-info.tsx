"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ProductoEntity, UnidadMedida } from "@/services/productos/entities/producto.entity"
import { Package, Tag, Truck, DollarSign, Scale } from "lucide-react"
import Link from "next/link"


const formatPrice = (price: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(price)
}

export default function ProductoInfo({ producto }: { producto: ProductoEntity }) {
  const getUnitLabel = (unit: UnidadMedida) => {
    const unitMap: Record<string, string> = {
      UND: "Unidades",
      MG: "Miligramos",
      GR: "Gramos",
      KG: "Kilogramos",
      LB: "Libras",
      TON: "Toneladas",
      ML: "Mililitros",
      L: "Litros",
      M3: "Metros cúbicos",
      GAL: "Galones",
      ONZ: "Onzas",
      MM: "Milímetros",
      CM: "Centímetros",
      M: "Metros",
      MTS: "Metros",
      PULG: "Pulgadas",
      PIES: "Pies",
      M2: "Metros cuadrados",
      TAZA: "Tazas",
      CDA: "Cucharadas",
      CTA: "Cucharaditas",
    }
    return unitMap[unit] || unit
  }

  const getTypeColor = (tipo: string) => {
    const typeColors: Record<string, string> = {
      Alimento: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Bebida: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Limpieza: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      Herramienta: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    }
    return typeColors[tipo] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
  }

  return (
    <Card className="w-full max-w-6xl mx-auto overflow-hidden border-t-4 border-t-primary mt-4">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-2xl font-bold leading-tight">{producto.nombre}</h2>
            <p className="text-sm text-muted-foreground">ID: {producto.id}</p>
          </div>
          <Badge className={`${getTypeColor(producto.tipo)} text-sm px-2 py-1`}>{producto.tipo}</Badge>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Precio Base */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
          <DollarSign className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Precio Base</p>
            <p className="text-2xl font-bold">{formatPrice(producto.precioBase)}</p>
          </div>
        </div>

        {/* Presentación */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Presentación</p>
            <p className="text-lg font-semibold">{producto.presentacion?.nombre || "No especificada"}</p>
            <p className="text-xs text-muted-foreground">ID: {producto.idPresentacion}</p>
          </div>
        </div>

        {/* Unidad de Medida y Peso/Volumen */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
          <Scale className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Medida</p>
            <p className="text-lg font-semibold">
              {producto.pesoVolumen} {producto.unidadMedida}
            </p>
            <p className="text-xs">{getUnitLabel(producto.unidadMedida)}</p>
          </div>
        </div>

        {/* Proveedor */}
        <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
          <Truck className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Proveedor</p>
            <p className="text-lg font-semibold">{producto.proveedor?.nombre || "No especificado"}</p>
            <p className="text-xs text-muted-foreground">ID: {producto.idProveedor}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 pt-4">
        <Link href={`/dashboard/productos/${producto.id}/editar`} passHref>
          <Button size="lg">
            <Tag className="h-5 w-5 mr-2" />
            Editar Producto
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

