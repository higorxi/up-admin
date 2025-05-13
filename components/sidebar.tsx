"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  Store,
  UserCheck,
  Settings,
  LogOut,
  FileText,
  Check,
  PartyPopper,
  User2Icon,
} from "lucide-react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

  {
    title: "Profissionais Indicados",
    href: "/profissionais/indicados",
    icon: PartyPopper,
  },
  {
    title: "Usuários",
    href: "/usuarios",
    icon: Users,
  },
  {
    title: "Profissionais",
    href: "/profissionais",
    icon: UserCheck,
  },
  {
    title: "Lojas",
    href: "/lojas",
    icon: Store,
  },
  {
    title: "Cadastros",
    href: "/cadastros",
    icon: FileText,
    subItems: [
      {
        title: "Aprovações",
        href: "/profissionais/aprovacao",
        icon: User2Icon
      },
    ],
  },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-gray-100/40 dark:bg-gray-800/40 lg:block lg:w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold">Admin - UP</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {sidebarNavItems.map((item) => (
              <React.Fragment key={item.href}>
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
                {item.subItems && item.subItems.length > 0 && (
                  <div className="ml-8 space-y-1 mt-1">
                    {item.subItems.map((subItem) => (
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
                        {subItem.title}</Link>
                      </Button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t p-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
