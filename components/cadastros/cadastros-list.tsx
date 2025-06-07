"use client"

import React from "react"

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
import { MoreHorizontal, Search, Eye, CheckCircle, XCircle, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cadastrosService } from "@/services/cadastros-service"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { lojasService } from "@/services/fornecedores-parceiros"

export function CadastrosList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [cadastros, setCadastros] = useState([])
  const [loading, setLoading] = useState(true)
  const [cadastroSelecionado, setCadastroSelecionado] = useState(null)
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState("todos")

  useEffect(() => {
    const carregarCadastros = async () => {
      try {
        const data = await lojasService.listarLojasParceirasPendentes()
        setCadastros(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os cadastros.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    carregarCadastros()
  }, [])

  const handleAlterarStatus = async (id, novoStatus) => {
    try {
      if (novoStatus === "Ativo") {
        await cadastrosService.ativarCadastro(id)
      } else {
        await cadastrosService.desativarCadastro(id)
      }

      setCadastros(cadastros.map((cadastro) => (cadastro.id === id ? { ...cadastro, status: novoStatus } : cadastro)))

      toast({
        title: `Cadastro ${novoStatus.toLowerCase()}`,
        description: `O cadastro foi ${novoStatus === "Ativo" ? "ativado" : "desativado"} com sucesso.`,
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: `Ocorreu um erro ao ${novoStatus === "Ativo" ? "ativar" : "desativar"} o cadastro.`,
        variant: "destructive",
      })
    }
  }

  // Extrair tipos únicos para o filtro
  const tiposCadastro = ["todos", ...new Set(cadastros.map((cadastro) => cadastro.tipo.toLowerCase()))]

  const filteredCadastros = cadastros.filter((cadastro) => {
    const matchesSearch =
      cadastro.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cadastro.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cadastro.tipo.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filtroStatus === "todos" || cadastro.status.toLowerCase() === filtroStatus.toLowerCase()

    const matchesTipo = filtroTipo === "todos" || cadastro.tipo.toLowerCase() === filtroTipo.toLowerCase()

    return matchesSearch && matchesStatus && matchesTipo
  })

  // Renderização para dispositivos móveis
  const renderMobileCard = (cadastro) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={cadastro.id}
      className="mb-4"
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-0">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <h3 className="font-medium">{cadastro.nome}</h3>
              <p className="text-sm text-muted-foreground">{cadastro.email}</p>
            </div>
            <Badge variant={cadastro.status === "Ativo" ? "success" : "secondary"}>{cadastro.status}</Badge>
          </div>
          <div className="p-4 grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Tipo:</div>
            <div>{cadastro.tipo}</div>
            <div className="font-medium">Data:</div>
            <div>{cadastro.dataCadastro}</div>
          </div>
          <div className="p-4 pt-0 flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => setCadastroSelecionado(cadastro)}>
              <Eye className="mr-2 h-4 w-4" />
              Detalhes
            </Button>
            {cadastro.status === "Ativo" ? (
              <Button variant="outline" size="sm" onClick={() => handleAlterarStatus(cadastro.id, "Inativo")}>
                <XCircle className="mr-2 h-4 w-4" />
                Desativar
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => handleAlterarStatus(cadastro.id, "Ativo")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Ativar
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
          <p className="text-muted-foreground">Carregando cadastros...</p>
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
            placeholder="Buscar cadastros..."
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
                  <option value="ativo">Ativos</option>
                  <option value="inativo">Inativos</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filtro-tipo">Tipo</Label>
                <select
                  id="filtro-tipo"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <option value="todos">Todos os tipos</option>
                  {tiposCadastro
                    .filter((tipo) => tipo !== "todos")
                    .map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
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
        {filteredCadastros.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">Nenhum cadastro encontrado.</div>
        ) : (
          filteredCadastros.map(renderMobileCard)
        )}
      </div>

      {/* Exibição para desktop */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCadastros.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum cadastro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredCadastros.map((cadastro) => (
                <TableRow key={cadastro.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{cadastro.nome}</span>
                      <span className="text-xs text-muted-foreground">{cadastro.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{cadastro.tipo}</TableCell>
                  <TableCell>{cadastro.dataCadastro}</TableCell>
                  <TableCell>
                    <Badge variant={cadastro.status === "Ativo" ? "success" : "secondary"}>{cadastro.status}</Badge>
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
                        <DropdownMenuItem onClick={() => setCadastroSelecionado(cadastro)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        {cadastro.status === "Ativo" ? (
                          <DropdownMenuItem onClick={() => handleAlterarStatus(cadastro.id, "Inativo")}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Desativar
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleAlterarStatus(cadastro.id, "Ativo")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Ativar
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

      {/* Modal de detalhes do cadastro */}
      <Dialog open={!!cadastroSelecionado} onOpenChange={(open) => !open && setCadastroSelecionado(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cadastro</DialogTitle>
            <DialogDescription>Informações completas do cadastro de {cadastroSelecionado?.nome}</DialogDescription>
          </DialogHeader>

          {cadastroSelecionado && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Informações Básicas</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Nome:</div>
                    <div>{cadastroSelecionado.nome}</div>
                    <div className="font-medium">Email:</div>
                    <div>{cadastroSelecionado.email}</div>
                    <div className="font-medium">Telefone:</div>
                    <div>{cadastroSelecionado.telefone}</div>
                    <div className="font-medium">Tipo:</div>
                    <div>{cadastroSelecionado.tipo}</div>
                    <div className="font-medium">Status:</div>
                    <div>
                      <Badge variant={cadastroSelecionado.status === "Ativo" ? "success" : "secondary"}>
                        {cadastroSelecionado.status}
                      </Badge>
                    </div>
                    <div className="font-medium">Data de Cadastro:</div>
                    <div>{cadastroSelecionado.dataCadastro}</div>
                  </div>
                </div>

                {cadastroSelecionado.endereco && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Endereço</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="font-medium">CEP:</div>
                      <div>{cadastroSelecionado.endereco.cep}</div>
                      <div className="font-medium">Rua:</div>
                      <div>{cadastroSelecionado.endereco.rua}</div>
                      <div className="font-medium">Número:</div>
                      <div>{cadastroSelecionado.endereco.numero}</div>
                      <div className="font-medium">Complemento:</div>
                      <div>{cadastroSelecionado.endereco.complemento || "-"}</div>
                      <div className="font-medium">Bairro:</div>
                      <div>{cadastroSelecionado.endereco.bairro}</div>
                      <div className="font-medium">Cidade:</div>
                      <div>{cadastroSelecionado.endereco.cidade}</div>
                      <div className="font-medium">Estado:</div>
                      <div>{cadastroSelecionado.endereco.estado}</div>
                    </div>
                  </div>
                )}
              </div>

              {cadastroSelecionado.documentos && cadastroSelecionado.documentos.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Documentos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cadastroSelecionado.documentos.map((doc, index) => (
                      <div
                        key={index}
                        className="border rounded-md p-3 flex justify-between items-center hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <div className="font-medium">{doc.tipo}</div>
                          <div className="text-xs text-muted-foreground">{doc.nome}</div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            Visualizar
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cadastroSelecionado.dadosAdicionais && Object.keys(cadastroSelecionado.dadosAdicionais).length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Dados Adicionais</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(cadastroSelecionado.dadosAdicionais).map(([chave, valor]) => (
                      <React.Fragment key={chave}>
                        <div className="font-medium">{chave}:</div>
                        <div>{valor.toString()}</div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              {cadastroSelecionado.observacoes && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Observações</h3>
                  <div className="text-sm border rounded-md p-3 bg-muted/30">{cadastroSelecionado.observacoes}</div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                id="status-switch"
                checked={cadastroSelecionado?.status === "Ativo"}
                onCheckedChange={(checked) =>
                  handleAlterarStatus(cadastroSelecionado.id, checked ? "Ativo" : "Inativo")
                }
              />
              <Label htmlFor="status-switch">{cadastroSelecionado?.status === "Ativo" ? "Ativo" : "Inativo"}</Label>
            </div>
            <Button onClick={() => setCadastroSelecionado(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
