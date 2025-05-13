import { AprovacaoList } from "@/components/profissionais/aprovacao-list"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AprovacaoProfissionaisPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/profissionais">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Aprovação de Profissionais</h1>
          <p className="text-muted-foreground">Aprove ou rejeite os cadastros de profissionais pendentes.</p>
        </div>
      </div>

      <AprovacaoList />
    </div>
  )
}
