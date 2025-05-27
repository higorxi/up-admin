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
import { MoreHorizontal, Search, Edit, Trash, MapPin, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { lojasService } from "@/services/lojas-service"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function LojasList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [lojas, setLojas] = useState([])
  const [loading, setLoading] = useState(true)
  const [lojaParaExcluir, setLojaParaExcluir] = useState(null)
  const [profissionaisLoja, setProfissionaisLoja] = useState([])
  const [lojaDetalhes, setLojaDetalhes] = useState(null)
  const [loadingProfissionais, setLoadingProfissionais] = useState(false)

  useEffect(() => {
    const carregarLojas = async () => {
      try {
        const data = await lojasService.listarLojas()
        setLojas(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as lojas.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    carregarLojas()
  }, [])

  const filteredLojas = lojas.filter(
    (loja) =>
      loja.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loja.endereco.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loja.endereco.estado.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExcluir = async () => {
    if (!lojaParaExcluir) return

    try {
      await lojasService.excluirLoja(lojaParaExcluir)
      setLojas(lojas.filter((l) => l.id !== lojaParaExcluir))
      toast({
        title: "Loja excluída",
        description: "A loja foi excluída com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a loja.",
        variant: "destructive",
      })
    } finally {
      setLojaParaExcluir(null)
    }
  }

  const handleAlterarStatus = async (id, novoStatus) => {
    try {
      if (novoStatus === "Ativa") {
        await lojasService.ativarLoja(id)
      } else {
        await lojasService.desativarLoja(id)
      }

      setLojas(lojas.map((loja) => (loja.id === id ? { ...loja, status: novoStatus } : loja)))

      toast({
        title: `Loja ${novoStatus.toLowerCase()}`,
        description: `A loja foi ${novoStatus === "Ativa" ? "ativada" : "desativada"} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao ${novoStatus === "Ativa" ? "ativar" : "desativar"} a loja.`,
        variant: "destructive",
      })
    }
  }

  const verProfissionais = async (lojaId) => {
    setLoadingProfissionais(true)
    try {
      const loja = lojas.find((l) => l.id === lojaId)
      setLojaDetalhes(loja)

      const profissionais = await lojasService.listarProfissionaisDaLoja(lojaId)
      setProfissionaisLoja(profissionais)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os profissionais da loja.",
        variant: "destructive",
      })
    } finally {
      setLoadingProfissionais(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Carregando lojas...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar lojas..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button asChild>
          <Link href="/fornecedores-parceiros/nova">Nova Loja</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Profissionais</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLojas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma loja encontrada.
                </TableCell>
              </TableRow>
            ) : (
              filteredLojas.map((loja) => (
                <TableRow key={loja.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{loja.nome}</span>
                      <span className="text-xs text-muted-foreground">{loja.cnpj}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {loja.endereco.cidade}, {loja.endereco.estado}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        loja.status === "Ativa" ? "success" : loja.status === "Inativa" ? "secondary" : "destructive"
                      }
                    >
                      {loja.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => verProfissionais(loja.id)}
                    >
                      <Users className="h-4 w-4" />
                      <span>{loja.totalProfissionais}</span>
                    </Button>
                  </TableCell>
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
                        <DropdownMenuItem asChild>
                          <Link href={`/fornecedores-parceiros/${loja.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => verProfissionais(loja.id)}>
                          <Users className="mr-2 h-4 w-4" />
                          Ver profissionais
                        </DropdownMenuItem>
                        {loja.status === "Ativa" ? (
                          <DropdownMenuItem onClick={() => handleAlterarStatus(loja.id, "Inativa")}>
                            Desativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleAlterarStatus(loja.id, "Ativa")}>
                            Ativar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setLojaParaExcluir(loja.id)}>
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

      <AlertDialog open={!!lojaParaExcluir} onOpenChange={(open) => !open && setLojaParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta loja? Esta ação não pode ser desfeita.
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

      <Dialog open={!!lojaDetalhes} onOpenChange={(open) => !open && setLojaDetalhes(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Profissionais da Loja</DialogTitle>
            <DialogDescription>
              {lojaDetalhes?.nome} - {lojaDetalhes?.endereco.cidade}/{lojaDetalhes?.endereco.estado}
            </DialogDescription>
          </DialogHeader>

          {loadingProfissionais ? (
            <div className="py-8 text-center">Carregando profissionais...</div>
          ) : profissionaisLoja.length === 0 ? (
            <div className="py-8 text-center">
              <p>Nenhum profissional associado a esta loja.</p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Especialidade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profissionaisLoja.map((profissional) => (
                    <TableRow key={profissional.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profissional.avatar || "/placeholder.svg"} alt={profissional.nome} />
                            <AvatarFallback>{profissional.nome.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{profissional.nome}</span>
                            <span className="text-xs text-muted-foreground">{profissional.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{profissional.especialidade}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            profissional.status === "Aprovado"
                              ? "success"
                              : profissional.status === "Pendente"
                                ? "warning"
                                : "destructive"
                          }
                        >
                          {profissional.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/profissionais/${profissional.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
