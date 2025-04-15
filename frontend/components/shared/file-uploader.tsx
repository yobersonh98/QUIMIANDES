"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import {
  type File,
  X,
  Upload,
  AlertCircle,
  CheckCircle2,
  FileText,
  FileImage,
  FileIcon as FilePdf,
  FileArchive,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  maxSize?: number // en MB
  allowedTypes?: string[]
  multiple?: boolean
}

interface FileWithPreview extends File {
  id: string
  preview?: string
  progress: number
  error?: string
}

export function FileUploader({ maxSize = 10, allowedTypes = ["*/*"], multiple = true }: FileUploaderProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        error: `El archivo excede el tamaño máximo de ${maxSize}MB`,
      }
    }

    // Validar tipo si no es '*/*'
    if (allowedTypes.length && !allowedTypes.includes("*/*")) {
      const fileType = file.type
      const isAllowed = allowedTypes.some((type) => {
        // Si el tipo termina con *, verificar el inicio del tipo
        if (type.endsWith("*")) {
          const typePrefix = type.slice(0, -1)
          return fileType.startsWith(typePrefix)
        }
        return type === fileType
      })

      if (!isAllowed) {
        return {
          valid: false,
          error: "Tipo de archivo no permitido",
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
        progress: validation.valid ? 100 : 0,
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

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const getFileIcon = (file: FileWithPreview) => {
    if (file.type.startsWith("image/")) {
      return <FileImage className="h-6 w-6 text-blue-500" />
    } else if (file.type === "application/pdf") {
      return <FilePdf className="h-6 w-6 text-red-500" />
    } else if (file.type.includes("zip") || file.type.includes("compressed")) {
      return <FileArchive className="h-6 w-6 text-yellow-500" />
    } else {
      return <FileText className="h-6 w-6 text-gray-500" />
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"

    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="w-full space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-all duration-200 ease-in-out",
          "flex flex-col items-center justify-center text-center",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              {isDragging ? "Suelta los archivos aquí" : "Arrastra y suelta archivos"}
            </h3>
            <p className="text-sm text-gray-500">o</p>
            <Button onClick={handleButtonClick} variant="outline" className="mt-2">
              Seleccionar archivos
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Tamaño máximo: {maxSize}MB</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInputChange}
          multiple={multiple}
          accept={allowedTypes.join(",")}
        />
      </div>

      {files.length > 0 && (
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-medium">Archivos seleccionados ({files.length})</h3>
          </div>
          <ul className="divide-y">
            {files.map((file) => (
              <li
                key={file.id}
                className={cn(
                  "p-4 flex items-center justify-between transition-colors",
                  file.error ? "bg-red-50" : "hover:bg-gray-50",
                )}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                  {file.preview ? (
                    <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
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
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      {file.error ? (
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>{file.type || "Desconocido"}</span>
                    </div>
                    {file.error && <p className="text-xs text-red-500 mt-1">{file.error}</p>}
                    {!file.error && file.progress < 100 && <Progress value={file.progress} className="h-1 mt-2" />}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="ml-2 flex-shrink-0">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
