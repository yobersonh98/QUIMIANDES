"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { X, AlertCircle, FileText, FileImage, FileIcon, Paperclip, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { BACKEND_URL } from "@/config/envs"
import { useToast } from "@/hooks/use-toast"
import { DocumentoEntity } from "@/services/pedidos/entity/pedido.entity"

// Tipos


interface FileWithPreview extends File {
  id: string
  preview?: string
  error?: string
}

interface FileStatus {
  id: string
  originalFile: FileWithPreview | null // Permitir null para archivos precargados
  uploading: boolean
  uploadComplete: boolean
  uploadError?: string
  uploadedData?: DocumentoEntity
}

interface CompactFileUploaderProps {
  maxSize?: number                       // en MB
  allowedTypes?: string[]                // tipos MIME permitidos
  multiple?: boolean                     // permitir múltiples archivos
  onChange?: (files: DocumentoEntity[]) => void  // callback cuando cambian los archivos
  autoUpload?: boolean                   // subir automáticamente los archivos
  showNotifications?: boolean            // mostrar notificaciones de toast
  disabled?: boolean                     // deshabilitar el componente
  className?: string                     // clase CSS personalizada
  uploadEndpoint?: string                // personalizar endpoint de subida
  maxFiles?: number                      // número máximo de archivos permitidos
  value?: DocumentoEntity[]                 // archivos iniciales (controlado)
}

// Hook para gestionar la subida de archivos
export function useFileUpload({
  onChange,
  uploadEndpoint = "/documents/upload",
  autoConfirm = true,
  showNotifications = true,
  initialFiles = []
}: {
  onChange?: (files: DocumentoEntity[]) => void
  uploadEndpoint?: string
  autoConfirm?: boolean
  showNotifications?: boolean
  initialFiles?: DocumentoEntity[]
}) {
  // Estado para archivos con previsualización (los que el usuario seleccionó)
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  
  // Estado para el seguimiento de la subida
  const [fileStatuses, setFileStatuses] = useState<FileStatus[]>(() => {
    // Inicializar el estado con los archivos iniciales (si existen)
    return initialFiles.map(file => ({
      id: file.id,
      originalFile: null, // No tenemos el archivo original, solo los datos del servidor
      uploading: false,
      uploadComplete: true,
      uploadedData: file
    }));
  });
  
  const filesConfirmed = useRef(false);
  const { data: session } = useSession();
  const token = session?.user?.token;
  const { toast } = useToast();

  // Limpiar archivos del servidor cuando el componente se desmonta si no se confirmaron
  useEffect(() => {
    return () => {
      if (!filesConfirmed.current && !autoConfirm) {
        fileStatuses.forEach(status => {
          if (status.uploadComplete && status.uploadedData) {
            deleteFileFromServer(status.uploadedData.id);
          }
        });
      }
    };
  }, [fileStatuses, autoConfirm]);

  // Notificar al componente padre cuando cambian los archivos subidos
  useEffect(() => {
    if (onChange) {
      const DocumentoEntitys = fileStatuses
        .filter(status => status.uploadComplete && status.uploadedData)
        .map(status => status.uploadedData!);
      onChange(DocumentoEntitys);
    }
  }, [fileStatuses, onChange]);

  // Subir archivo al servidor
  const uploadFileToServer = async (file: FileWithPreview) => {
    if (!token) {
      if (showNotifications) {
        toast({
          title: "Error de autenticación",
          description: "No se pudo verificar tu sesión. Inicia sesión nuevamente.",
          variant: "destructive"
        });
      }
      return;
    }

    // Actualizar estado para mostrar que está subiendo
    setFileStatuses(prev => [
      ...prev,
      {
        id: file.id,
        originalFile: file,
        uploading: true,
        uploadComplete: false
      }
    ]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('description', file.name);

      const response = await fetch(`${BACKEND_URL}${uploadEndpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
      }

      const DocumentoEntity: DocumentoEntity = await response.json();

      // Actualizar el estado con el resultado exitoso
      setFileStatuses(prev => prev.map(status => 
        status.id === file.id 
          ? { 
              ...status, 
              uploading: false, 
              uploadComplete: true, 
              uploadedData: DocumentoEntity 
            }
          : status
      ));

      if (showNotifications) {
        toast({
          title: "Archivo subido",
          description: `${file.name} se ha subido correctamente.`,
          variant: "default"
        });
      }

    } catch (error) {
      console.error("Error al subir archivo:", error);
      
      setFileStatuses(prev => prev.map(status => 
        status.id === file.id 
          ? { 
              ...status, 
              uploading: false, 
              uploadComplete: false, 
              uploadError: error instanceof Error ? error.message : 'Error al subir archivo' 
            }
          : status
      ));

      if (showNotifications) {
        toast({
          title: "Error al subir archivo",
          description: error instanceof Error ? error.message : 'Ocurrió un error al subir el archivo',
          variant: "destructive"
        });
      }
    }
  };

  // Eliminar archivo del servidor
  const deleteFileFromServer = async (fileId: string) => {
    if (!token) return;
    
    try {
      await fetch(`${BACKEND_URL}/documents/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error("Error al eliminar archivo del servidor:", error);
    }
  };

  // Validar archivo
  const validateFile = (file: File, maxSize: number, allowedTypes: string[]): { valid: boolean; error?: string } => {
    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      return {
        valid: false,
        error: `Excede ${maxSize}MB`,
      };
    }

    // Validar tipo si no es '*/*'
    if (allowedTypes.length && !allowedTypes.includes("*/*")) {
      const fileType = file.type;
      const isAllowed = allowedTypes.some((type) => {
        if (type.endsWith("*")) {
          const typePrefix = type.slice(0, -1);
          return fileType.startsWith(typePrefix);
        }
        return type === fileType;
      });

      if (!isAllowed) {
        return {
          valid: false,
          error: "Tipo no permitido",
        };
      }
    }

    return { valid: true };
  };

  // Procesar lista de archivos
  const processFiles = (fileList: FileList, maxSize: number, allowedTypes: string[], maxFiles?: number, autoUpload = true) => {
    const newFiles: FileWithPreview[] = [];
    
    // Verificar si excede el número máximo de archivos
    const currentFileCount = files.length + fileStatuses.filter(s => !files.some(f => f.id === s.id)).length;
    
    if (maxFiles !== undefined && currentFileCount + fileList.length > maxFiles) {
      if (showNotifications) {
        toast({
          title: "Límite de archivos",
          description: `Solo puedes subir un máximo de ${maxFiles} archivos.`,
          variant: "destructive"
        });
      }
      return;
    }

    Array.from(fileList).forEach((file) => {
      const validation = validateFile(file, maxSize, allowedTypes);

      const fileWithPreview: FileWithPreview = Object.assign(file, {
        id: `${file.name}-${Date.now()}`,
        error: validation.error,
      });

      // Crear preview para imágenes
      if (file.type.startsWith("image/") && validation.valid) {
        const reader = new FileReader();
        reader.onload = () => {
          fileWithPreview.preview = reader.result as string;
          setFiles((prev) => [...prev]);
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(fileWithPreview);

      // Si el archivo es válido y autoUpload está activado, subirlo al servidor
      if (validation.valid && autoUpload) {
        uploadFileToServer(fileWithPreview);
      }
    });

    setFiles((prev) => [...prev, ...newFiles]);
  };

  // Eliminar un archivo
  const removeFile = async (id: string) => {
    // Buscar si el archivo fue subido al servidor
    const fileStatus = fileStatuses.find(status => status.id === id);
    
    if (fileStatus?.uploadComplete && fileStatus.uploadedData) {
      // Si fue subido, eliminarlo del servidor
      await deleteFileFromServer(fileStatus.uploadedData.id);
    }
    
    // Actualizar estados
    setFiles((prev) => prev.filter((file) => file.id !== id));
    setFileStatuses((prev) => prev.filter((status) => status.id !== id));
  };

  // Confirmar archivos
  const confirmFiles = useCallback(() => {
    filesConfirmed.current = true;
  }, []);

  // Crear un método para subir todos los archivos pendientes
  const uploadAllPending = () => {
    const pendingFiles = files.filter(file => 
      !fileStatuses.some(status => status.id === file.id) && !file.error
    );
    
    pendingFiles.forEach(file => {
      uploadFileToServer(file);
    });
  };
  
  // Reiniciar el estado del uploader
  const reset = () => {
    // Primero eliminar todos los archivos del servidor
    fileStatuses.forEach(status => {
      if (status.uploadComplete && status.uploadedData) {
        deleteFileFromServer(status.uploadedData.id);
      }
    });
    
    // Luego resetear los estados
    setFiles([]);
    setFileStatuses([]);
  };

  // Actualizar los archivos precargados cuando cambian externamente
  const updatePreloadedFiles = (newFiles: DocumentoEntity[]) => {
    // Primero, encontrar qué archivos ya no están en la nueva lista
    const currentFileIds = fileStatuses
      .filter(status => status.uploadComplete && status.uploadedData)
      .map(status => status.uploadedData!.id);
    
    const newFileIds = newFiles.map(file => file.id);
    
    // Eliminar archivos que ya no existen en la nueva lista
    fileStatuses
      .filter(status => status.uploadComplete && status.uploadedData && !newFileIds.includes(status.uploadedData.id))
      .forEach(status => {
        if (status.uploadedData) {
          // No eliminamos del servidor, asumimos que el componente padre ya manejó eso
          setFileStatuses(prev => prev.filter(s => s.id !== status.id));
        }
      });
    
    // Agregar nuevos archivos que no existían antes
    newFiles
      .filter(file => !currentFileIds.includes(file.id))
      .forEach(file => {
        setFileStatuses(prev => [
          ...prev,
          {
            id: file.id,
            originalFile: null,
            uploading: false,
            uploadComplete: true,
            uploadedData: file
          }
        ]);
      });
  };

  return {
    files,
    fileStatuses,
    processFiles,
    removeFile,
    confirmFiles,
    uploadFileToServer,
    uploadAllPending,
    reset,
    updatePreloadedFiles,
    getDocumentoEntitys: () => fileStatuses
      .filter(status => status.uploadComplete && status.uploadedData)
      .map(status => status.uploadedData!)
  };
}

// Componente principal
export function CompactFileUploader({
  maxSize = 5,
  allowedTypes = ["*/*"],
  multiple = true,
  onChange,
  autoUpload = true,
  showNotifications = true,
  disabled = false,
  className = "",
  uploadEndpoint = "/documents/upload",
  maxFiles,
  value
}: CompactFileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const {
    files,
    fileStatuses,
    processFiles,
    removeFile,
    confirmFiles,
    updatePreloadedFiles
  } = useFileUpload({
    onChange,
    uploadEndpoint,
    autoConfirm: true,
    showNotifications,
    initialFiles: value || []
  });
  
  // Si se proporciona un valor controlado, sincronizarlo cuando cambie
  useEffect(() => {
    if (value !== undefined) {
      updatePreloadedFiles(value);
    }
  }, [value]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isDragging && !disabled) {
        setIsDragging(true);
      }
    },
    [isDragging, disabled],
  );

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files, maxSize, allowedTypes, maxFiles, autoUpload);
    }
  }, [processFiles, maxSize, allowedTypes, maxFiles, autoUpload, disabled]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files, maxSize, allowedTypes, maxFiles, autoUpload);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <FileImage className="h-4 w-4 text-primary" />;
    } else if (mimeType === "application/pdf") {
      return <FileIcon className="h-4 w-4 text-destructive" />;
    } else {
      return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getFileStatusIcon = (fileId: string) => {
    const status = fileStatuses.find(s => s.id === fileId);
    
    if (!status) return null;
    
    if (status.uploading) {
      return <Loader2 className="h-3 w-3 text-primary animate-spin" />;
    } else if (status.uploadComplete) {
      return <CheckCircle className="h-3 w-3 text-green-500" />;
    } else if (status.uploadError) {
      return <AlertCircle className="h-3 w-3 text-destructive" />;
    }
    
    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Combinar archivos locales y remotos para mostrar
  const allFiles = [
    ...files,
    ...fileStatuses
      .filter(status => 
        status.uploadedData && 
        status.uploadComplete && 
        !files.some(file => file.id === status.id)
      )
      .map(status => ({
        id: status.id,
        name: status.uploadedData!.originalName,
        size: status.uploadedData!.size,
        type: status.uploadedData!.mimeType,
        preview: status.uploadedData!.url.startsWith('http') ? status.uploadedData!.url : undefined,
        DocumentoEntity: status.uploadedData
      })) as unknown as FileWithPreview[]
  ];

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div
        className={cn(
          "border border-dashed rounded-md p-3 transition-all duration-200 ease-in-out",
          "flex flex-col items-center justify-center text-center",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-input hover:border-primary/50 hover:bg-accent",
          disabled && "opacity-50 cursor-not-allowed hover:bg-background hover:border-input"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-1">
          <Paperclip className="h-5 w-5 text-muted-foreground mb-1" />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {isDragging ? "Suelta aquí" : "Arrastra archivos o"}
            </p>

            <label
              htmlFor="file-upload-direct"
              className={cn(
                "inline-flex h-7 items-center justify-center rounded-md border border-input bg-background px-3 text-xs font-medium shadow-sm",
                !disabled && "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              Seleccionar
              <input
                id="file-upload-direct"
                type="file"
                className="sr-only"
                onChange={handleFileInputChange}
                multiple={multiple}
                accept={allowedTypes.join(",")}
                disabled={disabled}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            {maxFiles ? `Máx: ${maxFiles} archivos, ` : ""}
            Máx: {maxSize}MB
            {allowedTypes.length === 1 && allowedTypes[0] !== "*/*" && 
              ` (${allowedTypes.join(", ")})`
            }
          </p>
        </div>
      </div>

      {allFiles.length > 0 && (
        <ul className="text-sm space-y-1 mt-2">
          {allFiles.map((file) => {
            const fileStatus = fileStatuses.find(s => s.id === file.id);
            
            return (
              <li
                key={file.id}
                className={cn(
                  "py-1 px-2 flex items-center justify-between rounded",
                  file.error 
                    ? "bg-destructive/10"
                    : fileStatus?.uploadError
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
                    getFileIcon(file.type)
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1">
                      <p className="text-xs font-medium truncate">{file.name}</p>
                      {getFileStatusIcon(file.id)}
                      {file.error && <AlertCircle className="h-3 w-3 text-destructive flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {formatFileSize(file.size)}
                      {file.error && <span className="text-destructive ml-1">{file.error}</span>}
                      {fileStatus?.uploadError && (
                        <span className="text-destructive ml-1">{fileStatus.uploadError}</span>
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="h-5 w-5 rounded-full ml-1"
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}