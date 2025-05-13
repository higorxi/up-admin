"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, Edit, Trash, Lock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usuariosService } from "@/services/usuarios-service"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function UsuariosList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState(null)
  const [usuarioParaRedefinirSenha, setUsuarioParaRedefinirSenha] = useState(null)
  const [redefinindoSenha, setRedefinindoSenha] = useState(false)

  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        const data = await usuariosService.listarUsuarios()
        setUsuarios(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os usuários.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    carregarUsuarios()
  }, [])

  const filteredUsuarios = usuarios.filter(
    (usuario) =>
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExcluir = async () => {
    if (!usuarioParaExcluir) return

    try {
      await usuariosService.excluirUsuario(usuarioParaExcluir)
      setUsuarios(usuarios.filter((u) => u.id !== usuarioParaExcluir))
      toast({
        title: "Usuário excluído",
        description: "O usuário foi excluído com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o usuário.",
        variant: "destructive",
      })
    } finally {
      setUsuarioParaExcluir(null)
    }
  }

  const handleAlterarStatus = async (id, novoStatus) => {
    try {
      if (novoStatus === "Ativo") {
        await usuariosService.ativarUsuario(id)
      } else {
        await usuariosService.desativarUsuario(id)
      }

      setUsuarios(usuarios.map((usuario) => (usuario.id === id ? { ...usuario, status: novoStatus } : usuario)))

      toast({
        title: `Usuário ${novoStatus.toLowerCase()}`,
        description: `O usuário foi ${novoStatus === "Ativo" ? "ativado" : "desativado"} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao ${novoStatus === "Ativo" ? "ativar" : "desativar"} o usuário.`,
        variant: "destructive",
      })
    }
  }

  const handleRedefinirSenha = async () => {
    if (!usuarioParaRedefinirSenha) return

    setRedefinindoSenha(true)
    try {
      await usuariosService.redefinirSenha(usuarioParaRedefinirSenha)
      toast({
        title: "Senha redefinida",
        description: "A senha do usuário foi redefinida com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao redefinir a senha do usuário.",
        variant: "destructive",
      })
    } finally {
      setUsuarioParaRedefinirSenha(null)
      setRedefinindoSenha(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Carregando usuários...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuários..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>Novo Usuário</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsuarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum usuário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsuarios.map((usuario) => (
                <TableRow key={usuario.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={usuario.avatar || "/placeholder.svg"} alt={usuario.nome} />
                        <AvatarFallback>{usuario.nome.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{usuario.nome}</span>
                        <span className="text-xs text-muted-foreground">{usuario.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{usuario.tipo}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        usuario.status === "Ativo"
                          ? "success"
                          : usuario.status === "Inativo"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {usuario.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{usuario.dataCadastro}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setUsuarioParaRedefinirSenha(usuario.id)}>
                          <Lock className="mr-2 h-4 w-4" />
                          Redefinir senha
                        </DropdownMenuItem>
                        {usuario.status === "Ativo" ? (
                          <DropdownMenuItem onClick={() => handleAlterarStatus(usuario.id, "Inativo")}>
                            Desativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleAlterarStatus(usuario.id, "Ativo")}>
                            Ativar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setUsuarioParaExcluir(usuario.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!usuarioParaExcluir} onOpenChange={(open) => !open && setUsuarioParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleExcluir} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={!!usuarioParaRedefinirSenha} onOpenChange={(open) => !open && setUsuarioParaRedefinirSenha(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redefinir senha</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja redefinir a senha deste usuário? Uma nova senha será gerada e enviada por email.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUsuarioParaRedefinirSenha(null)}>
              Cancelar
            </Button>
            <Button onClick={handleRedefinirSenha} disabled={redefinindoSenha}>
              {redefinindoSenha ? "Redefinindo..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
