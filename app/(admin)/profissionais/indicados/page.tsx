import { ProfissionaisIndicadosList } from "@/components/profissionais/profissionais-indicados-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ProfissionaisIndicadosPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profissionais Indicados</h1>
          <p className="text-muted-foreground">Gerencie os profissionais indicados no sistema.</p>
        </div>
        <Button asChild>
          <Link href="/profissionais/indicados/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Profissional Indicado
          </Link>
        </Button>
      </div>

      <ProfissionaisIndicadosList />
    </div>
  )
}
