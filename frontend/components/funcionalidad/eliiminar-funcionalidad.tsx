
"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FuncionalidadService } from "@/services/funcionalidad/funcionalidad.service";
import { useSession } from "next-auth/react";
import { ConfirmButton } from "../shared/confirm-botton";

export function EliminarFuncionalidad({ id }: { id: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const session = useSession()
  const handleDelete = async () => {
    try {
      const response = await new FuncionalidadService(session.data?.user.token).eliminar(id);

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Funcionalidad eliminada",
        description: "La funcionalidad ha sido eliminada correctamente.",
      });
      router.refresh();
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la funcionalidad",
        variant: "destructive",
      });
    } finally {
    }
  };

  return (
    <>
      <ConfirmButton
        variant="ghost"
        className="w-full justify-start text-destructive"
        onClick={handleDelete}
      >
        Eliminar
      </ConfirmButton>
    </>
  );
}