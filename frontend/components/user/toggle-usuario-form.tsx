"use client"

import React from 'react'
import { Button } from '../ui/button'
import { PlusCircle, Pencil } from 'lucide-react'
import { UserEntity } from '@/services/usuario/entity/user.entity'
import { UsuarioDialog } from './usuario-dialog-form'

type ToggleFormUsuarioProps = {
  usuario?: UserEntity
  text?: string
  variant?: "default" | "outline" | "ghost" | "link" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export default function ToggleFormUsuario({
  usuario,
  text,
  variant = "default",
  size = "default",
  className = "",
  children
}: ToggleFormUsuarioProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const isEditing = !!usuario?.id

  return (
    <>
      <Button
        className={`gap-2 ${className}`}
        onClick={() => setIsOpen(true)}
        variant={variant}
        size={size}
      >
        { children || ( isEditing ? (
          <>
            <Pencil className="h-4 w-4" />
            {text || "Editar Usuario"}
          </>
        ) : (
          <>
            <PlusCircle className="h-4 w-4" />
            {text || "Crear Usuario"}
          </>
        ))}
      </Button>
      <UsuarioDialog
        usuario={usuario} 
        open={isOpen} 
        onOpenChange={setIsOpen}
        isEditing={isEditing}
      />
    </>
  )
}