import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para los pedidos
const orderTracking = [
  { id: 1, client: "Empresa A", document: "900123456-7", order: "Químicos industriales", status: "En proceso" },
  { id: 2, client: "Empresa B", document: "901234567-8", order: "Solventes orgánicos", status: "Enviado" },
  { id: 3, client: "Empresa C", document: "902345678-9", order: "Ácidos y bases", status: "Entregado" },
  { id: 4, client: "Empresa D", document: "903456789-0", order: "Reactivos de laboratorio", status: "Pendiente" },
]

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      {/* Tabla de seguimiento de pedidos */}
      <Card>
        <CardHeader>
          <CardTitle>Seguimiento de Pedidos</CardTitle>
          <CardDescription>Estado actual de los pedidos de clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Pedido</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderTracking.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.client}</TableCell>
                  <TableCell>{order.document}</TableCell>
                  <TableCell>{order.order}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        order.status === "Entregado"
                          ? "success"
                          : order.status === "Enviado"
                            ? "info"
                            : order.status === "En proceso"
                              ? "warning"
                              : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* ... (resto del contenido del dashboard) ... */}
      </div>
    </div>
  )
}

