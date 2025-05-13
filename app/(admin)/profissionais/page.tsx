import { ProfissionaisList } from "@/components/profissionais/profissionais-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

export default function ProfissionaisPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profissionais</h1>
          <p className="text-muted-foreground">Gerencie os profissionais cadastrados no sistema.</p>
        </div>
        <Button asChild>
          <Link href="/profissionais/novo">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Profissional
          </Link>
        </Button>
      </div>

      <ProfissionaisList />
    </div>
  )
}
