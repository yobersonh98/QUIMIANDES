"use client"

import React from 'react'
import { Button } from '../ui/button'
import { PlusCircle, Pencil } from 'lucide-react'
import { FuncionalidadDialog } from './funcionalidad-dialog'
import { FuncionalidadEntity } from '@/services/funcionalidad/entity/funcionalidad.entity'

type ToggleActivoFuncionalidadProps = {
  funcionalidad?: FuncionalidadEntity
  text?: string
  variant?: "default" | "outline" | "ghost" | "link" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  children?: React.ReactNode
}

export default function ToggleFormFuncionalidad({
  funcionalidad,
  text,
  variant = "default",
  size = "default",
  className = "",
  children
}: ToggleActivoFuncionalidadProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const isEditing = !!funcionalidad?.id

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
            {text || "Editar Funcionalidad"}
          </>
        ) : (
          <>
            <PlusCircle className="h-4 w-4" />
            {text || "Crear Funcionalidad"}
          </>
        ))}
      </Button>
      <FuncionalidadDialog 
        funcionalidad={funcionalidad} 
        open={isOpen} 
        onOpenChange={setIsOpen}
        isEditing={isEditing}
      />
    </>
  )
}