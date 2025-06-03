import { PartnerSuppliersList } from "@/components/lojas/lojas-list";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { BeneficiosList } from "@/components/beneficios/beneficios-list";
import { WorkshopList } from "@/components/workshops/workshops-list";

export default function LojasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Workshops
          </h1>
          <p className="text-muted-foreground">
            Gerencie os workshops cadastrados no sistema.
          </p>
        </div>

        <Button asChild>
          <Link href="/profissionais/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Workshop
          </Link>
        </Button>
      </div>
      <WorkshopList />
    </div>
  );
}
