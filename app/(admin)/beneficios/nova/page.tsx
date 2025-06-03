import { BeneficiosForm } from "@/components/beneficios/beneficios-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NovaLojaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/fornecedores-parceiros">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Beneficios</h1>
          <p className="text-muted-foreground">Cadastre um novo beneficio no sistema.</p>
        </div>
      </div>

      <BeneficiosForm />
    </div>
  )
}
