"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  LucideIcon,
  Building2,
  Calendar,
  CheckCircle,
  FolderOpen,
  Gift,
  GraduationCap,
  Palette,
  UserCheck2,
  Users,
} from "lucide-react";

interface sidebarNavItems {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  tooltip?: string;
  subItems?: sidebarNavItems[];
}
const sidebarNavItems: sidebarNavItems[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profissionais",
    href: "/profissionais",
    icon: Users,
  },
  {
    title: "Fornecedores Parceiros",
    href: "/fornecedores-parceiros",
    icon: Building2,
  },
  {
    title: "Amante de Decoração",
    tooltip: "Em desenvolvimento",
    href: "/amantes-de-decoracao",
    icon: Palette,
  },
  {
    title: "Profissionais Indicados",
    href: "/profissionais-indicados",
    icon: UserCheck2,
  },
  {
    title: "Workshops",
    href: "/workshops",
    tooltip: "Em breve disponível",
    icon: GraduationCap,
  },
  {
    title: "Eventos",
    href: "/eventos",
    tooltip: "Em breve disponível",
    icon: Calendar,
  },
  {
    title: "Beneficios",
    href: "/beneficios",
    tooltip: "Em breve disponível",
    icon: Gift,
  },
  {
    title: "Cadastros",
    href: "/profissionais/aprovacao",
    icon: FolderOpen,
    subItems: [
      {
        title: "Aprovações",
        href: "/profissionais/aprovacao",
        icon: CheckCircle,
      },
    ],
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    tooltip: "Em breve disponível",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:block fixed top-0 left-0 w-64 h-screen border-r bg-gray-100/40 dark:bg-gray-800/40 z-50">
      <div className="flex h-full flex-col">
        <div className="flex h-32 flex-col items-center justify-center border-b px-6">
          <Link
            href="/"
            className="flex flex-col items-center gap-1 font-semibold"
          >
            <Image
              src="/logo-up-completa.svg"
              alt="UP Club Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </Link>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {sidebarNavItems.map((item) => (
              <React.Fragment key={item.href}>
                {item.disabled ? (
                  <div
                    title={item.tooltip}
                    className="flex h-10 items-center justify-start gap-2 px-4 cursor-not-allowed text-muted-foreground opacity-60"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.title}
                  </div>
                ) : (
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "flex h-10 items-center justify-start gap-2 px-4",
                      pathname === item.href
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  </Button>
                )}

                {/* SubItens */}
                {item.subItems && item.subItems.length > 0 && (
                  <div className="ml-8 space-y-1 mt-1">
                    {item.subItems.map((subItem) =>
                      subItem.disabled ? (
                        <div
                          key={subItem.href}
                          title={subItem.tooltip}
                          className="flex h-8 items-center justify-start gap-2 px-4 text-sm cursor-not-allowed text-muted-foreground opacity-60"
                        >
                          <subItem.icon className="h-4 w-4" />
                          {subItem.title}
                        </div>
                      ) : (
                        <Button
                          key={subItem.href}
                          variant={
                            pathname === subItem.href ? "secondary" : "ghost"
                          }
                          className={cn(
                            "flex h-8 items-center justify-start gap-2 px-4 text-sm",
                            pathname === subItem.href
                              ? "bg-gray-200 dark:bg-gray-700"
                              : "hover:bg-gray-200 dark:hover:bg-gray-700"
                          )}
                          asChild
                        >
                          <Link href={subItem.href}>
                            <subItem.icon className="h-4 w-4" />
                            {subItem.title}
                          </Link>
                        </Button>
                      )
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <Link href={"/login"}>
            <Button variant="outline" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
