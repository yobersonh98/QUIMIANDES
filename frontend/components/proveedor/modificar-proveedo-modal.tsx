"use client"

import { useState } from "react"
import { ProveedorForm } from "./proveedor-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { CrearProveedorModel } from "@/services/proveedor/models/crear-proveedor.model"
import { useSession } from "next-auth/react"
import { ProveedorEntity } from "@/services/proveedor/entities/proveedor.entity"
import { useToast } from "@/hooks/use-toast"
import { ProveedorService } from "@/services/proveedor/provedor.service"
import RefreshPage from "@/actions/refresh-page"

type ModificarProveedorModalProps = {
  proveedor: ProveedorEntity
}

export function ModificarProveedorModal({ proveedor }: ModificarProveedorModalProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const session = useSession()
  const toast = useToast()
  const handleSubmit = async (dataForm: CrearProveedorModel) => {
    try {
      setIsSubmitting(true)
      const {  data, error} = await  new ProveedorService(session.data?.user?.token).modificar({
        ...dataForm,
        id: proveedor.id,
      })
      console.log(data)
      if (error) {
         toast.toast({
          title: "Error al modificar proveedor",
          description: error.message,
         })
         return;
      }
      if (data) {
        toast.toast({
          title: "Proveedor modificado",
          description: `El proveedor ${data.nombre} ha sido modificado correctamente.`,
        })
      }
      await RefreshPage("/dashboard/proveedores")
      setOpen(false)
    } catch (error) {
      console.error("Error al modificar proveedor:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modificar Proveedor</DialogTitle>
          <DialogDescription>Actualice la información del proveedor.</DialogDescription>
        </DialogHeader>
        <ProveedorForm
          proveedor={proveedor}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}

