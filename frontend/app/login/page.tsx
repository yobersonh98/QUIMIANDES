import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Columna izquierda: formulario */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            QUIMIANDES TA S.A.S
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-foreground lg:flex items-center justify-center">
        <Image
          src="/assets/images/logo.png"
          alt="Logo"
          width={300}
          height={300}
          className="object-contain"
        />
      </div>
    </div>
  )
}
