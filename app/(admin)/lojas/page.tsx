import { LojasList } from "@/components/lojas/lojas-list"

export default function LojasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lojas</h1>
        <p className="text-muted-foreground">Gerencie as lojas cadastradas no sistema.</p>
      </div>

      <LojasList />
    </div>
  )
}
