import { ProfissionalIndicadoForm } from "@/components/profissionais-indicados/profissional-indicado-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NovoProfissionalIndicadoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/profissionais-indicados">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Profissional Indicado</h1>
          <p className="text-muted-foreground">Cadastre um novo profissional indicado no sistema.</p>
        </div>
      </div>

      <ProfissionalIndicadoForm />
    </div>
  )
}
