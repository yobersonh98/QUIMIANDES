"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { X, AlertCircle, FileText, FileImage, FileIcon, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CompactFileUploaderProps {
  maxSize?: number // en MB
  allowedTypes?: string[]
  multiple?: boolean
  onChange?: (files: File[]) => void
}

interface FileWithPreview extends File {
  id: string
  preview?: string
  error?: string
}

export function CompactFileUploader({
  maxSize = 5,
  allowedTypes = ["*/*"],
  multiple = true,
  onChange,
}: CompactFileUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Notificar al componente padre cuando cambian los archivos
  useEffect(() => {
    if (onChange) {
      // Filtrar archivos sin errores para el callback
      const validFiles = files.filter(file => !file.error)
      onChange(validFiles)
    }
  }, [files, onChange])

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (!isDragging) {
        setIsDragging(true)
      }
    },
    [isDragging],
  )

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      return {
        valid: false,
        error: `Excede ${maxSize}MB`,
      }
    }

    // Validar tipo si no es '*/*'
    if (allowedTypes.length && !allowedTypes.includes("*/*")) {
      const fileType = file.type
      const isAllowed = allowedTypes.some((type) => {
        if (type.endsWith("*")) {
          const typePrefix = type.slice(0, -1)
          return fileType.startsWith(typePrefix)
        }
        return type === fileType
      })

      if (!isAllowed) {
        return {
          valid: false,
          error: "Tipo no permitido",
        }
      }
    }

    return { valid: true }
  }

  const processFiles = (fileList: FileList) => {
    const newFiles: FileWithPreview[] = []

    Array.from(fileList).forEach((file) => {
      const validation = validateFile(file)

      const fileWithPreview: FileWithPreview = Object.assign(file, {
        id: `${file.name}-${Date.now()}`,
        error: validation.error,
      })

      // Crear preview para imágenes
      if (file.type.startsWith("image/") && validation.valid) {
        const reader = new FileReader()
        reader.onload = () => {
          fileWithPreview.preview = reader.result as string
          setFiles((prev) => [...prev])
        }
        reader.readAsDataURL(file)
      }

      newFiles.push(fileWithPreview)
    })

    setFiles((prev) => [...prev, ...newFiles])
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const getFileIcon = (file: FileWithPreview) => {
    if (file.type.startsWith("image/")) {
      return <FileImage className="h-4 w-4 text-primary" />
    } else if (file.type === "application/pdf") {
      return <FileIcon className="h-4 w-4 text-destructive" />
    } else {
      return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  return (
    <div className="w-full space-y-2">
      <div
        className={cn(
          "border border-dashed rounded-md p-3 transition-all duration-200 ease-in-out",
          "flex flex-col items-center justify-center text-center",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-input hover:border-primary/50 hover:bg-accent",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-1">
          <Paperclip className="h-5 w-5 text-muted-foreground mb-1" />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{isDragging ? "Suelta aquí" : "Arrastra archivos o"}</p>

            {/* Implementación alternativa usando label en lugar de botón */}
            <label
              htmlFor="file-upload-direct"
              className="inline-flex h-7 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
            >
              Seleccionar
              <input
                id="file-upload-direct"
                type="file"
                className="sr-only"
                onChange={handleFileInputChange}
                multiple={multiple}
                accept={allowedTypes.join(",")}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">Máx: {maxSize}MB</p>
        </div>
      </div>

      {files.length > 0 && (
        <ul className="text-sm space-y-1 mt-2">
          {files.map((file) => (
            <li
              key={file.id}
              className={cn(
                "py-1 px-2 flex items-center justify-between rounded",
                file.error 
                  ? "bg-destructive/10" 
                  : "hover:bg-accent",
              )}
            >
              <div className="flex items-center space-x-2 overflow-hidden min-w-0">
                {file.preview ? (
                  <div className="h-6 w-6 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={file.preview || "/placeholder.svg"}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  getFileIcon(file)
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-1">
                    <p className="text-xs font-medium truncate">{file.name}</p>
                    {file.error && <AlertCircle className="h-3 w-3 text-destructive flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {formatFileSize(file.size)}
                    {file.error && <span className="text-destructive ml-1">{file.error}</span>}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(file.id)}
                className="h-5 w-5 rounded-full ml-1"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}