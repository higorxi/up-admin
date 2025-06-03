import { PartnerSuppliersList } from "@/components/lojas/lojas-list";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { AmantesDeDecoracaoList } from "@/components/amantes-de-decoracao/amantes-de-decoracao-list";

export default function LojasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Amante de Decoração
          </h1>
          <p className="text-muted-foreground">
            Gerencie os amantes de decoração cadastrados no sistema.
          </p>
        </div>

        <Button asChild>
          <Link href="/profissionais/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Amante de Decoração
          </Link>
        </Button>
      </div>
      <AmantesDeDecoracaoList />
    </div>
  );
}
