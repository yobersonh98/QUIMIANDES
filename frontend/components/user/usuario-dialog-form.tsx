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
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "../ui/checkbox"
import { useSession } from "next-auth/react"
import RefreshPage from "@/actions/refresh-page"
import { usePathname } from "next/navigation"
import { UserEntity } from "@/services/usuario/entity/user.entity"
import { UserService } from "@/services/usuario/usuario.service"

interface UsuarioDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  usuario?: UserEntity
  isEditing?: boolean
}

export function UsuarioDialog({ 
  open, 
  onOpenChange, 
  usuario,
  isEditing = false 
}: UsuarioDialogProps) {
  const [formData, setFormData] = useState(usuario || {
    name: "",
    email: "",
    estado: true,
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const session = useSession()
  const pathname = usePathname()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const service = new UserService(session.data?.user.token)
      let response
      
      if (isEditing && usuario?.id) {
        // Lógica para editar
        response = await service.actualizar({
          id: usuario.id,
          name: formData.name,
          email: formData.email,
          estado: formData.estado
        })
      } else {
        // Lógica para crear
        response = await service.crear({
          name: formData.name,
          email: formData.email,
          estado: formData.estado,
          password: formData.password || '' // Make sure to handle password properly in your API
        })
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
        title: isEditing ? "Usuario actualizado" : "Usuario creado",
        description: isEditing 
          ? "El usuario ha sido actualizado exitosamente." 
          : "El usuario ha sido creado exitosamente.",
      })

      await RefreshPage(pathname)
      onOpenChange(false)
      
      if (!isEditing) {
        setFormData({ 
          name: "", 
          email: "", 
          estado: true,
          password: ""
        })
      }
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: isEditing 
          ? "No se pudo actualizar el usuario." 
          : "No se pudo crear el usuario.",
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
            {isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "Modifica los datos del usuario seleccionado." 
              : "Define un nuevo usuario del sistema con sus características."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre completo del usuario"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            {!isEditing && (
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  required={!isEditing}
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="estado"
                checked={formData.estado}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, estado: Boolean(checked) }))}
              />
              <Label htmlFor="estado">Usuario activo</Label>
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