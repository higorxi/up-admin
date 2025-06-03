import { LojaForm } from "@/components/lojas/loja-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditarLojaPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/fornecedores-parceiros">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Loja</h1>
          <p className="text-muted-foreground">Edite as informações da loja.</p>
        </div>
      </div>

      <LojaForm id={params.id} />
    </div>
  )
}
