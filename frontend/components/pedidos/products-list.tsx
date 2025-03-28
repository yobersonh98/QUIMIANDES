"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Clock, Truck } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type DeliveryLocation = {
  id: string
  name: string
  city: string
}

type Product = {
  id: string
  name: string
  requirementDate: string
  presentation: string
  unit: number
  quantity: number
  dispatchedQuantity: number
  total: number
  receivedWeight: number
  deliveryType: string
  deliveryLocation: DeliveryLocation
  deliveryStatus: string
}

type ProductsListProps = {
  products: Product[]
}

export function ProductsList({ products }: ProductsListProps) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" /> Pendientes
          </TabsTrigger>
          <TabsTrigger value="partial" className="flex items-center gap-2">
            <Truck className="h-4 w-4" /> Parciales
          </TabsTrigger>
          <TabsTrigger value="delivered" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Entregados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {products
            .filter((product) => product.deliveryStatus === "Pendiente")
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </TabsContent>

        <TabsContent value="partial" className="space-y-4">
          {products
            .filter((product) => product.deliveryStatus === "Entregado Parcialmente")
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-4">
          {products
            .filter((product) => product.deliveryStatus === "Entregado")
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const getStatusIcon = () => {
    switch (product.deliveryStatus) {
      case "Entregado":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "Entregado Parcialmente":
        return <Truck className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = () => {
    let variant: "default" | "secondary" | "outline" = "outline"

    switch (product.deliveryStatus) {
      case "Entregado":
        variant = "default"
        break
      case "Entregado Parcialmente":
        variant = "secondary"
        break
    }

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {getStatusIcon()}
        {product.deliveryStatus}
      </Badge>
    )
  }

  // Calcular el porcentaje de entrega
  const deliveryPercentage = Math.min(Math.round((product.dispatchedQuantity / product.quantity) * 100), 100)

  return (
    <Card
      className={cn(
        "border-l-4",
        product.deliveryStatus === "Entregado"
          ? "border-l-green-500"
          : product.deliveryStatus === "Entregado Parcialmente"
            ? "border-l-yellow-500"
            : "border-l-blue-500",
      )}
    >
      <CardContent className="p-4">
        <div className="grid gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                {product.name}
                <span className="text-sm font-normal text-muted-foreground">({product.id})</span>
              </h3>
              <p className="text-sm text-muted-foreground">
                {product.presentation} - Requerido para: {product.requirementDate}
              </p>
            </div>
            <div>{getStatusBadge()}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Cantidad Solicitada</div>
              <div>{product.quantity.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Cantidad Despachada</div>
              <div>{product.dispatchedQuantity.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Tipo de Entrega</div>
              <div>{product.deliveryType}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Lugar de Entrega</div>
              <div>
                {product.deliveryLocation.name}, {product.deliveryLocation.city}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progreso de entrega</span>
              <span>{deliveryPercentage}%</span>
            </div>
            <Progress value={deliveryPercentage} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

