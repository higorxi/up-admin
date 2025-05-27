"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Search, Edit, Trash, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { profissionaisService } from "@/services/profissionais-service"
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

export function ProfissionaisList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [profissionais, setProfissionais] = useState([])
  const [loading, setLoading] = useState(true)
  const [profissionalParaExcluir, setProfissionalParaExcluir] = useState(null)

  useEffect(() => {
    const carregarProfissionais = async () => {
      try {
        const data = await profissionaisService.listarProfissionais()
        setProfissionais(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os profissionais.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    carregarProfissionais()
  }, [])

  const filteredProfissionais = profissionais.filter(
    (profissional) =>
      profissional.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profissional.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profissional.especialidade.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAprovar = async (id) => {
    try {
      await profissionaisService.aprovarProfissional(id)
      setProfissionais(profissionais.map((p) => (p.id === id ? { ...p, status: "Aprovado" } : p)))
      toast({
        title: "Profissional aprovado",
        description: "O profissional foi aprovado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao aprovar o profissional.",
        variant: "destructive",
      })
    }
  }

  const handleRejeitar = async (id) => {
    try {
      await profissionaisService.rejeitarProfissional(id)
      setProfissionais(profissionais.map((p) => (p.id === id ? { ...p, status: "Rejeitado" } : p)))
      toast({
        title: "Profissional rejeitado",
        description: "O profissional foi rejeitado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao rejeitar o profissional.",
        variant: "destructive",
      })
    }
  }

  const handleExcluir = async () => {
    if (!profissionalParaExcluir) return

    try {
      await profissionaisService.excluirProfissional(profissionalParaExcluir)
      setProfissionais(profissionais.filter((p) => p.id !== profissionalParaExcluir))
      toast({
        title: "Profissional excluído",
        description: "O profissional foi excluído com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o profissional.",
        variant: "destructive",
      })
    } finally {
      setProfissionalParaExcluir(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Carregando profissionais...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar profissionais..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfissionais.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum profissional encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProfissionais.map((profissional) => (
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
                  <TableCell>{profissional.dataCadastro}</TableCell>
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
                          <Link href={`/profissionais/${profissional.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        {profissional.status === "Pendente" && (
                          <>
                            <DropdownMenuItem onClick={() => handleAprovar(profissional.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Aprovar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRejeitar(profissional.id)}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Rejeitar
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setProfissionalParaExcluir(profissional.id)}
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

      <AlertDialog open={!!profissionalParaExcluir} onOpenChange={(open) => !open && setProfissionalParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este profissional? Esta ação não pode ser desfeita.
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
    </div>
  )
}
