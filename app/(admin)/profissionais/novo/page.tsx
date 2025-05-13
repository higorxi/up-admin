import { ProfissionalForm } from "@/components/profissionais/profissional-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NovoProfissionalPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/profissionais">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Profissional</h1>
          <p className="text-muted-foreground">Cadastre um novo profissional no sistema.</p>
        </div>
      </div>

      <ProfissionalForm />
    </div>
  )
}
