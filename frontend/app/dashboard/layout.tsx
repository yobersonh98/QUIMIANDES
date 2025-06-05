"use client"

import type React from "react"
import { useState } from "react"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"
import { ShoppingBag, Package, Clipboard, Settings, LogOut, User, Home, Logs } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Navigation menu component that handles mobile sidebar closing
function NavigationMenu() {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const menuItems = [
    { icon: Home, label: "Inicio", href: "/dashboard" },
    { icon: Clipboard, label: "Pedidos", href: "/dashboard/pedidos" },
    { icon: Clipboard, label: "Gestionar Entregas", href: "/dashboard/entregas-pedido" },
    { icon: ShoppingBag, label: "Clientes", href: "/dashboard/clientes" },
    { icon: Package, label: "Proveedores", href: "/dashboard/proveedores" },
    { icon: Package, label: "Productos", href: "/dashboard/productos" },
    { icon: Logs, label: "Auditoria", href: "/dashboard/auditoria" },
  ]

  // Handle menu item click - close sidebar on mobile
  const handleMenuItemClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <SidebarMenu >
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton asChild isActive={pathname === item.href}>
            <Link
              href={item.href}
              className={pathname === item.href ? "text-primary font-medium" : ""}
              onClick={handleMenuItemClick}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { setTheme, theme } = useTheme()
  const [companyInfo] = useState({
    name: "Quimiandes TA S.A.S.",
    logo: "/placeholder.svg",
  })

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4  bg-background">
            <h1 className="text-xl font-bold my-1">{companyInfo.name}</h1>
          </SidebarHeader>
          <SidebarContent className="bg-background">
            <NavigationMenu />
          </SidebarContent>
          <SidebarFooter className="mt-auto p-4 border-t text-sm text-muted-foreground  bg-background">
            <p className="font-semibold">Quimiandes TA S.A.S.</p>
            <p>&copy; 2025 Todos los derechos reservados</p>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex justify-between items-center p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger />
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Cambiar tema</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt="@usuario" />
                      <AvatarFallback>US</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Usuario</p>
                      <p className="text-xs leading-none text-muted-foreground">usuario@ejemplo.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

