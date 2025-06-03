import { PartnerSuppliersList } from "@/components/lojas/lojas-list";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { BeneficiosList } from "@/components/beneficios/beneficios-list";

export default function LojasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Benefícios
          </h1>
          <p className="text-muted-foreground">
            Gerencie os beneficios do sistema.
          </p>
        </div>

        <Button asChild>
          <Link href="/profissionais/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Benefício
          </Link>
        </Button>
      </div>
      <BeneficiosList />
    </div>
  );
}
