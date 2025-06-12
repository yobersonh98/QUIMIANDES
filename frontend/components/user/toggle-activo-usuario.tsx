"use client";

import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { UserService } from "@/services/usuario/usuario.service";

export function ToggleActivoUsuario({
  id,
  currentState,
}: {
  id: string;
  currentState: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const session = useSession();

  const handleToggle = async () => {
    try {
      const response = await new UserService(session.data?.user.token).actualizar({
        id,
        estado: !currentState,
      });

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Estado actualizado",
        description: `El usuario ha sido ${!currentState ? "activado" : "desactivado"} correctamente.`,
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del usuario",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={handleToggle}
    >
      {currentState ? "Desactivar" : "Activar"}
    </Button>
  );
}