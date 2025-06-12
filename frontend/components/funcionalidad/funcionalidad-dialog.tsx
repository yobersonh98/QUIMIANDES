"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "../ui/checkbox"
import { useSession } from "next-auth/react"
import { FuncionalidadService } from "@/services/funcionalidad/funcionalidad.service"
import RefreshPage from "@/actions/refresh-page"
import { usePathname } from "next/navigation"
import { FuncionalidadEntity } from "@/services/funcionalidad/entity/funcionalidad.entity"

interface FuncionalidadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  funcionalidad?: FuncionalidadEntity
  isEditing?: boolean
}

export function FuncionalidadDialog({ 
  open, 
  onOpenChange, 
  funcionalidad,
  isEditing = false 
}: FuncionalidadDialogProps) {
  const [formData, setFormData] = useState(funcionalidad || {
    nombre: "",
    descripcion: "",
    ruta: "",
    icon: "",
    activo: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const session = useSession()
  const pathname = usePathname()



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const service = new FuncionalidadService(session.data?.user.token)
      let response
      const model = {
          nombre: formData.nombre,
          activo: formData.activo,
          ruta: formData.icon || '',
          descripcion: formData.descripcion || '',
      }
      if (isEditing && funcionalidad?.id) {
        // Lógica para editar
        response = await service.modificar({
          ...model,
          id: funcionalidad.id
        })
      } else {
        // Lógica para crear
        response = await service.crear(model)
      }

      if (response.error) {
        toast({
          title: 'Error',
          description: response.error.message,
          variant: 'destructive'
        })
        return
      }

      toast({
        title: isEditing ? "Funcionalidad actualizada" : "Funcionalidad creada",
        description: isEditing 
          ? "La funcionalidad ha sido actualizada exitosamente." 
          : "La funcionalidad ha sido creada exitosamente.",
      })

      await RefreshPage(pathname)
      onOpenChange(false)
      
      if (!isEditing) {
        setFormData({ 
          nombre: "", 
          descripcion: "", 
          ruta: "", 
          icon: "", 
          activo: true 
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: isEditing 
          ? "No se pudo actualizar la funcionalidad." 
          : "No se pudo crear la funcionalidad.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Funcionalidad" : "Crear Nueva Funcionalidad"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifica los datos de la funcionalidad seleccionada." 
              : "Define una nueva funcionalidad del sistema con sus características."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre de la funcionalidad</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: usuarios, productos, reportes"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Describe qué hace esta funcionalidad..."
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ruta">Ruta de Next.js</Label>
              <Input
                id="ruta"
                value={formData.ruta || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ruta: e.target.value }))}
                placeholder="/dashboard/usuarios"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icono (opcional)</Label>
              <Input
                id="icon"
                value={formData.icon || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="Users, Settings, BarChart..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="activo"
                checked={formData.activo}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, activo: Boolean(checked) }))}
              />
              <Label htmlFor="activo">Funcionalidad activa</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading 
                ? isEditing ? "Actualizando..." : "Creando..." 
                : isEditing ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}