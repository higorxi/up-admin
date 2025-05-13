import { UsuariosList } from "@/components/usuarios/usuarios-list"

export default function UsuariosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usuários</h1>
        <p className="text-muted-foreground">Gerencie os usuários cadastrados no sistema.</p>
      </div>

      <UsuariosList />
    </div>
  )
}
