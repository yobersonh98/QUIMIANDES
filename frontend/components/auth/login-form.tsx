"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

type FormValues = {
  email: string;
  password: string;
};

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      setErrors([]);

      const responseNextAuth = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      
      if (responseNextAuth?.error) {
        setErrors(responseNextAuth.error.split(","));
        return;
      }
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrors(["Ha ocurrido un error inesperado"]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Iniciar sesión en tu cuenta</h1>
          <p className="text-balance text-sm text-muted-foreground">
            Ingresa tu correo electrónico para acceder a tu cuenta
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              {...register("email", { 
                required: "El correo electrónico es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Por favor, introduce un correo electrónico válido"
                }
              })}
              aria-invalid={formErrors.email ? "true" : "false"}
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Contraseña</Label>
              <a
                href="#"
                className="ml-auto text-sm underline-offset-4 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              {...register("password", { 
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres"
                }
              })}
              aria-invalid={formErrors.password ? "true" : "false"}
            />
            {formErrors.password && (
              <p className="text-sm text-red-500">{formErrors.password.message}</p>
            )}
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar sesión"
            )}
          </Button>
        </div>
        <div className="text-center text-sm">
          ¿No tienes una cuenta?{" "}
          <a href="#" className="underline underline-offset-4">
            Regístrate
          </a>
        </div>
      </form>
      {errors.length > 0 && (
        <div className="mt-4 p-3 rounded bg-red-50 border border-red-200 text-red-600">
          <ul className="list-disc pl-4">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}