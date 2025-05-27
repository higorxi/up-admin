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
import { MoreHorizontal, Search, Edit, Trash, CheckCircle, XCircle, Star, Award } from "lucide-react"
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
import Loading from "../loading"

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
      profissional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profissional.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profissional.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profissional.officeName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleToggleVerified = async (id, currentStatus) => {
    try {
      await profissionaisService.alterarVerificacao(id, !currentStatus)
      setProfissionais(profissionais.map((p) => (p.id === id ? { ...p, verified: !currentStatus } : p)))
      toast({
        title: currentStatus ? "Verificação removida" : "Profissional verificado",
        description: currentStatus 
          ? "A verificação do profissional foi removida com sucesso."
          : "O profissional foi verificado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar o status de verificação.",
        variant: "destructive",
      })
    }
  }

  const handleToggleFeatured = async (id, currentStatus) => {
    try {
      await profissionaisService.alterarDestaque(id, !currentStatus)
      setProfissionais(profissionais.map((p) => (p.id === id ? { ...p, featured: !currentStatus } : p)))
      toast({
        title: currentStatus ? "Destaque removido" : "Profissional destacado",
        description: currentStatus 
          ? "O profissional foi removido dos destaques com sucesso."
          : "O profissional foi adicionado aos destaques com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao alterar o status de destaque.",
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

  const getLevelBadgeVariant = (level) => {
    switch (level) {
      case "GOLD":
        return "default"
      case "SILVER":
        return "secondary"
      case "BRONZE":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (loading) {
    return <Loading text="Carregando profissionais..."/>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar profissionais por nome, email, profissão ou nome do estabelecimento..."
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
              <TableHead>Profissional</TableHead>
              <TableHead>Profissão</TableHead>
              <TableHead>Estabelecimento</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfissionais.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum profissional encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProfissionais.map((profissional) => (
                <TableRow key={profissional.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profissional.profileImage || "/placeholder.svg"} alt={profissional.name} />
                        <AvatarFallback>{profissional.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{profissional.name}</span>
                          {profissional.verified && (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          )}
                          {profissional.featured && (
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">{profissional.user.email}</span>
                        <span className="text-xs text-muted-foreground">{profissional.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{profissional.profession}</span>
                      {profissional.registrationAgency && (
                        <span className="text-xs text-muted-foreground">{profissional.registrationAgency}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{profissional.officeName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={getLevelBadgeVariant(profissional.level)}>
                        {profissional.level}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{profissional.points} pts</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={profissional.verified ? "success" : "secondary"}
                        className="w-fit"
                      >
                        {profissional.verified ? "Verificado" : "Não verificado"}
                      </Badge>
                      {profissional.featured && (
                        <Badge variant="outline" className="w-fit">
                          Destacado
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(profissional.user.createdAt)}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleToggleVerified(profissional.id, profissional.verified)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {profissional.verified ? "Remover Verificação" : "Verificar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(profissional.id, profissional.featured)}>
                          <Star className="mr-2 h-4 w-4" />
                          {profissional.featured ? "Remover Destaque" : "Destacar"}
                        </DropdownMenuItem>
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