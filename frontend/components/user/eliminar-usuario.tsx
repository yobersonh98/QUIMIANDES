"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { ConfirmButton } from "../shared/confirm-botton";
import { UserService } from "@/services/usuario/usuario.service";

export function EliminarUsuario({ id }: { id: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const session = useSession();

  const handleDelete = async () => {
    try {
      const response = await new UserService(session.data?.user.token).eliminar(id);

      if (response.error) {
        throw response.error;
      }

      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente.",
      });
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  return (
    <ConfirmButton
      variant="ghost"
      className="w-full justify-start text-destructive"
      onClick={handleDelete}
    >
      Eliminar
    </ConfirmButton>
  );
}