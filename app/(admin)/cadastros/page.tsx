import { CadastrosList } from "@/components/cadastros/cadastros-list"

export default function CadastrosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastros</h1>
        <p className="text-muted-foreground">Gerencie os cadastros recebidos no sistema.</p>
      </div>

      <CadastrosList />
    </div>
  )
}
