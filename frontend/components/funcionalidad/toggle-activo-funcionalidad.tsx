// src/modules/funcionalidad/components/toggle-activo-funcionalidad.tsx

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FuncionalidadService } from "@/services/funcionalidad/funcionalidad.service";
import { useSession } from "next-auth/react";

export function ToggleActivoFuncionalidad({
  id,
  currentState,
}: {
  id: string;
  currentState: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const session = useSession()
  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const response = await new FuncionalidadService(session.data?.user.token).modificar({
        id,
        activo: !currentState,
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Estado actualizado",
        description: `La funcionalidad ha sido ${
          !currentState ? "activada" : "desactivada"
        } correctamente.`,
      });
      router.refresh();
    } catch (e) {
      console.log(e)
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado de la funcionalidad",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={handleToggle}
      disabled={isLoading}
    >
      {currentState ? "Desactivar" : "Activar"}
    </Button>
  );
}