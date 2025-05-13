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
import { MoreHorizontal, Search, Edit, Eye, CheckCircle, XCircle, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { profissionaisService } from "@/services/profissionais-service"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"

export function ProfissionaisIndicadosList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [profissionais, setProfissionais] = useState([])
  const [loading, setLoading] = useState(true)
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null)
  const [profissionalParaDesativar, setProfissionalParaDesativar] = useState(null)
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroEspecialidade, setFiltroEspecialidade] = useState("todas")

  useEffect(() => {
    const carregarProfissionais = async () => {
      try {
        const data = await profissionaisService.listarProfissionaisIndicados()
        setProfissionais(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os profissionais indicados.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    carregarProfissionais()
  }, [])

  // Extrair especialidades únicas para o filtro
  const especialidades = ["todas", ...new Set(profissionais.map((p) => p.especialidade.toLowerCase()))]

  const filteredProfissionais = profissionais.filter((profissional) => {
    const matchesSearch =
      profissional.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profissional.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profissional.especialidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (profissional.indicadoPor && profissional.indicadoPor.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = filtroStatus === "todos" || profissional.status.toLowerCase() === filtroStatus.toLowerCase()

    const matchesEspecialidade =
      filtroEspecialidade === "todas" || profissional.especialidade.toLowerCase() === filtroEspecialidade.toLowerCase()

    return matchesSearch && matchesStatus && matchesEspecialidade
  })

  const handleDesativar = async () => {
    if (!profissionalParaDesativar) return

    try {
      await profissionaisService.desativarProfissional(profissionalParaDesativar)
      setProfissionais(profissionais.map((p) => (p.id === profissionalParaDesativar ? { ...p, status: "Inativo" } : p)))
      toast({
        title: "Profissional desativado",
        description: "O profissional foi desativado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao desativar o profissional.",
        variant: "destructive",
      })
    } finally {
      setProfissionalParaDesativar(null)
    }
  }

  const handleAtivar = async (id) => {
    try {
      await profissionaisService.ativarProfissional(id)
      setProfissionais(profissionais.map((p) => (p.id === id ? { ...p, status: "Aprovado" } : p)))
      toast({
        title: "Profissional ativado",
        description: "O profissional foi ativado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao ativar o profissional.",
        variant: "destructive",
      })
    }
  }

  // Renderização para dispositivos móveis
  const renderMobileCard = (profissional) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={profissional.id}
      className="mb-4"
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-0">
          <div className="p-4 border-b flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profissional.avatar || "/placeholder.svg"} alt={profissional.nome} />
              <AvatarFallback>{profissional.nome.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">{profissional.nome}</h3>
              <p className="text-xs text-muted-foreground">{profissional.email}</p>
            </div>
            <Badge
              variant={
                profissional.status === "Aprovado"
                  ? "success"
                  : profissional.status === "Pendente"
                    ? "warning"
                    : profissional.status === "Inativo"
                      ? "secondary"
                      : "destructive"
              }
            >
              {profissional.status}
            </Badge>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Especialidade:</div>
            <div>{profissional.especialidade}</div>
            <div className="font-medium">Indicado por:</div>
            <div>{profissional.indicadoPor}</div>
          </div>
          <div className="p-4 pt-0 flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => setProfissionalSelecionado(profissional)}>
              <Eye className="mr-2 h-4 w-4" />
              Detalhes
            </Button>
            {profissional.status === "Inativo" ? (
              <Button variant="outline" size="sm" onClick={() => handleAtivar(profissional.id)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Ativar
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setProfissionalParaDesativar(profissional.id)}>
                <XCircle className="mr-2 h-4 w-4" />
                Desativar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 min-h-[300px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando profissionais indicados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar profissionais indicados..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Collapsible open={filtrosAbertos} onOpenChange={setFiltrosAbertos} className="w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Filtros</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filtros</span>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/30">
              <div className="space-y-2">
                <Label htmlFor="filtro-status">Status</Label>
                <select
                  id="filtro-status"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={filtroStatus}
                  onChange={(e) => setFiltroStatus(e.target.value)}
                >
                  <option value="todos">Todos os status</option>
                  <option value="aprovado">Aprovados</option>
                  <option value="pendente">Pendentes</option>
                  <option value="inativo">Inativos</option>
                  <option value="rejeitado">Rejeitados</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filtro-especialidade">Especialidade</Label>
                <select
                  id="filtro-especialidade"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={filtroEspecialidade}
                  onChange={(e) => setFiltroEspecialidade(e.target.value)}
                >
                  <option value="todas">Todas as especialidades</option>
                  {especialidades
                    .filter((esp) => esp !== "todas")
                    .map((especialidade) => (
                      <option key={especialidade} value={especialidade}>
                        {especialidade.charAt(0).toUpperCase() + especialidade.slice(1)}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Exibição para dispositivos móveis */}
      <div className="md:hidden">
        {filteredProfissionais.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Nenhum profissional indicado encontrado.</div>
        ) : (
          filteredProfissionais.map(renderMobileCard)
        )}
      </div>

      {/* Exibição para desktop */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Especialidade</TableHead>
              <TableHead>Indicado Por</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProfissionais.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum profissional indicado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredProfissionais.map((profissional) => (
                <TableRow key={profissional.id} className="hover:bg-muted/50 transition-colors">
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
                  <TableCell>{profissional.indicadoPor}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        profissional.status === "Aprovado"
                          ? "success"
                          : profissional.status === "Pendente"
                            ? "warning"
                            : profissional.status === "Inativo"
                              ? "secondary"
                              : "destructive"
                      }
                    >
                      {profissional.status}
                    </Badge>
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
                        <DropdownMenuItem onClick={() => setProfissionalSelecionado(profissional)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/profissionais/${profissional.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        {profissional.status === "Inativo" ? (
                          <DropdownMenuItem onClick={() => handleAtivar(profissional.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Ativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => setProfissionalParaDesativar(profissional.id)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Desativar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de detalhes do profissional */}
      <Dialog open={!!profissionalSelecionado} onOpenChange={(open) => !open && setProfissionalSelecionado(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Profissional Indicado</DialogTitle>
            <DialogDescription>Informações completas do profissional indicado</DialogDescription>
          </DialogHeader>

          {profissionalSelecionado && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-2">
                    <AvatarImage
                      src={profissionalSelecionado.avatar || "/placeholder.svg"}
                      alt={profissionalSelecionado.nome}
                    />
                    <AvatarFallback>{profissionalSelecionado.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{profissionalSelecionado.nome}</h3>
                  <p className="text-sm text-muted-foreground">{profissionalSelecionado.especialidade}</p>
                  <Badge className="mt-2" variant="outline">
                    Profissional Indicado
                  </Badge>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Email</h4>
                      <p>{profissionalSelecionado.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Telefone</h4>
                      <p>{profissionalSelecionado.telefone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Documento</h4>
                      <p>{profissionalSelecionado.documento}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Data de cadastro</h4>
                      <p>{profissionalSelecionado.dataCadastro}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Status</h4>
                      <Badge
                        variant={
                          profissionalSelecionado.status === "Aprovado"
                            ? "success"
                            : profissionalSelecionado.status === "Pendente"
                              ? "warning"
                              : profissionalSelecionado.status === "Inativo"
                                ? "secondary"
                                : "destructive"
                        }
                      >
                        {profissionalSelecionado.status}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Indicado por</h4>
                      <p>{profissionalSelecionado.indicadoPor}</p>
                    </div>
                  </div>

                  {profissionalSelecionado.biografia && (
                    <div>
                      <h4 className="text-sm font-medium">Biografia</h4>
                      <p className="text-sm p-3 border rounded-md bg-muted/30">{profissionalSelecionado.biografia}</p>
                    </div>
                  )}

                  {profissionalSelecionado.endereco && (
                    <div>
                      <h4 className="text-sm font-medium">Endereço</h4>
                      <p className="text-sm p-3 border rounded-md bg-muted/30">
                        {profissionalSelecionado.endereco.rua}, {profissionalSelecionado.endereco.numero}
                        {profissionalSelecionado.endereco.complemento &&
                          `, ${profissionalSelecionado.endereco.complemento}`}{" "}
                        - {profissionalSelecionado.endereco.bairro}, {profissionalSelecionado.endereco.cidade}/
                        {profissionalSelecionado.endereco.estado} - CEP: {profissionalSelecionado.endereco.cep}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setProfissionalSelecionado(null)}>
              Fechar
            </Button>
            <Button asChild>
              <Link href={`/profissionais/${profissionalSelecionado?.id}`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            {profissionalSelecionado?.status === "Inativo" ? (
              <Button
                onClick={() => {
                  handleAtivar(profissionalSelecionado.id)
                  setProfissionalSelecionado(null)
                }}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Ativar
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={() => {
                  setProfissionalParaDesativar(profissionalSelecionado.id)
                  setProfissionalSelecionado(null)
                }}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Desativar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação para desativar */}
      <AlertDialog
        open={!!profissionalParaDesativar}
        onOpenChange={(open) => !open && setProfissionalParaDesativar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desativar profissional</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja desativar este profissional? Ele não aparecerá mais nas listagens padrão.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDesativar} className="bg-destructive text-destructive-foreground">
              Desativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
