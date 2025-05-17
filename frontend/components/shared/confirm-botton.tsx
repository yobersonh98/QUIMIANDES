"use client"

import type React from "react"

import { useState } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface ConfirmButtonProps extends ButtonProps {
  onClick: () => void | Promise<void>
  title?: string
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  children: React.ReactNode
}

export function ConfirmButton({
  onClick,
  title = "Confirmar Acción",
  description = (
    <>
      ¿Está seguro de realizar esta acción?
      <br />
      <br />
      Tenga en cuenta que esta acción marcará el pedido como entregado y no podrá revertirse.
    </>
  ),
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  children,
  ...props
}: ConfirmButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onClick()
      setOpen(false)
    } catch (error) {
      console.error("Error executing action:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button {...props}>{children}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            {cancelText}
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

