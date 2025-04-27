"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp, Download, File } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { DocumentoEntity } from "@/services/pedidos/entity/pedido.entity"

interface DocumentosListaProps {
  documentos: DocumentoEntity[]
  titulo?: string
  className?: string
  mostrarTipos?: boolean
  mostrarFechas?: boolean
  emptyMessage?: string
  defaultOpen?: boolean
}

export function DocumentosLista({
  documentos,
  titulo = "Documentos",
  className,
  mostrarTipos = false,
  mostrarFechas = false,
  emptyMessage = "No hay documentos disponibles",
  defaultOpen = false,
}: DocumentosListaProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  // Función para obtener la extensión del archivo
  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || ""
  }

  // Función para determinar el color de la badge según la extensión
  const getBadgeColor = (extension: string) => {
    switch (extension) {
      case "pdf":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "doc":
      case "docx":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "xls":
      case "xlsx":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "jpg":
      case "jpeg":
      case "png":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Formatear fecha si está disponible
  const formatearFecha = (fecha?: string) => {
    if (!fecha) return ""
    try {
      return new Date(fecha).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return fecha
    }
  }

  if (!documentos || documentos.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <Collapsible open={isOpen}>
          <CollapsibleTrigger
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full px-6 py-4 font-medium text-left border-b"
          >
            <h3 className="text-lg font-semibold">{titulo}</h3>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
          <CardContent className="pt-4">
            <p className="text-muted-foreground text-center py-4">{emptyMessage}</p>
          </CardContent>
        </CollapsibleContent>
        </Collapsible>

      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-6 py-4 font-medium text-left border-b">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{titulo}</h3>
            <Badge variant="outline" className="ml-2">
              {documentos.length}
            </Badge>
          </div>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {documentos.map((documento) => {
                const extension = getFileExtension(documento.originalName)

                return (
                  <li
                    key={documento.id}
                    className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <File className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" title={documento.originalName}>
                          {documento.originalName}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className={cn("text-xs", getBadgeColor(extension))}>
                            {extension.toUpperCase()}
                          </Badge>

                          {mostrarTipos && documento.tipo && (
                            <Badge variant="outline" className="text-xs">
                              {documento.tipo}
                            </Badge>
                          )}

                          {mostrarFechas && documento.fechaCreacion && (
                            <span className="text-xs text-muted-foreground">
                              {formatearFecha(documento.fechaCreacion)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <a
                        href={documento.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        title={`Descargar ${documento.originalName}`}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Descargar {documento.originalName}</span>
                      </a>
                    </Button>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}
