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
import { PlusCircle } from "lucide-react"
import { CrearProveedorModel } from "@/services/proveedor/models/crear-proveedor.model"
import { ProveedorService } from "@/services/proveedor/provedor.service"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import RefreshPage from "@/actions/refresh-page"

export function CrearProveedorModal() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const session = useSession()
  const { toast } = useToast()
  const handleSubmit = async (dataForm: CrearProveedorModel) => {
    try {
      setIsSubmitting(true)
      const { data, error } = await new ProveedorService(session.data?.user?.token).crear({
        ...dataForm,
      })
      if (error) {
        toast({
          title: "Error al crear proveedor",
          description: error.message,
        })
        return
      }
      toast({
        title: "Proveedor creado",
        description: `El proveedor ${data?.nombre} ha sido creado correctamente.`,
      })
      await RefreshPage("/dashboard/proveedores");
      setOpen(false)
    } catch (error) {
      console.error("Error al crear proveedor:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Nuevo Proveedor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Proveedor</DialogTitle>
          <DialogDescription>Complete el formulario para registrar un nuevo proveedor en el sistema.</DialogDescription>
        </DialogHeader>
        <ProveedorForm onSubmit={handleSubmit} onCancel={() => setOpen(false)} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  )
}

