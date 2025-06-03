import { PartnerSuppliersList } from "@/components/lojas/lojas-list";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link"
import { EventosList } from "@/components/eventos/eventos-list";

export default function LojasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Eventos
          </h1>
          <p className="text-muted-foreground">
            Gerencie os eventos cadastrados no sistema.
          </p>
        </div>

        <Button asChild>
          <Link href="/profissionais/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Evento
          </Link>
        </Button>
      </div>
      <EventosList />
    </div>
  );
}
