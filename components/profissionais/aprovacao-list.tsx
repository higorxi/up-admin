"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Eye } from "lucide-react"
import { profissionaisService } from "@/services/profissionais-service"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function AprovacaoList() {
  const [profissionais, setProfissionais] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [motivoRejeicao, setMotivoRejeicao] = useState("")
  const [profissionalParaRejeitar, setProfissionalParaRejeitar] = useState(null)
  const [profissionalDetalhes, setProfissionalDetalhes] = useState(null)

  useEffect(() => {
    const carregarProfissionais = async () => {
      try {
        const data = await profissionaisService.listarProfissionaisPendentes()
        setProfissionais(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os profissionais pendentes.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    carregarProfissionais()
  }, [])

  const handleAprovar = async (id) => {
    try {
      await profissionaisService.aprovarProfissional(id)
      setProfissionais(profissionais.filter((p) => p.id !== id))
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

  const handleRejeitar = async () => {
    if (!profissionalParaRejeitar) return

    try {
      await profissionaisService.rejeitarProfissional(profissionalParaRejeitar, motivoRejeicao)
      setProfissionais(profissionais.filter((p) => p.id !== profissionalParaRejeitar))
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
    } finally {
      setProfissionalParaRejeitar(null)
      setMotivoRejeicao("")
    }
  }

  const abrirDetalhes = (profissional) => {
    setProfissionalDetalhes(profissional)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-medium">Carregando profissionais pendentes...</h3>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (profissionais.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-medium">Nenhum profissional pendente</h3>
            <p className="text-muted-foreground">Não há profissionais aguardando aprovação no momento.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {profissionais.map((profissional) => (
          <Card key={profissional.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="warning">Pendente</Badge>
                <div className="text-xs text-muted-foreground">{profissional.dataCadastro}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center mb-4">
                <Avatar className="h-20 w-20 mb-2">
                  <AvatarImage src={profissional.avatar || "/placeholder.svg"} alt={profissional.nome} />
                  <AvatarFallback>{profissional.nome.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{profissional.nome}</CardTitle>
                <CardDescription>{profissional.especialidade}</CardDescription>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Email:</span>
                  <span>{profissional.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Telefone:</span>
                  <span>{profissional.telefone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Documento:</span>
                  <span>{profissional.documento}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Button variant="outline" size="sm" onClick={() => abrirDetalhes(profissional)}>
                <Eye className="mr-2 h-4 w-4" />
                Detalhes
              </Button>
              <div className="flex gap-2">
                <Button variant="destructive" size="sm" onClick={() => setProfissionalParaRejeitar(profissional.id)}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeitar
                </Button>
                <Button variant="default" size="sm" onClick={() => handleAprovar(profissional.id)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprovar
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Modal de rejeição */}
      <Dialog open={!!profissionalParaRejeitar} onOpenChange={(open) => !open && setProfissionalParaRejeitar(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar profissional</DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição. Esta informação será enviada ao profissional.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo da rejeição</Label>
              <Textarea
                id="motivo"
                placeholder="Descreva o motivo da rejeição..."
                value={motivoRejeicao}
                onChange={(e) => setMotivoRejeicao(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfissionalParaRejeitar(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRejeitar} disabled={!motivoRejeicao.trim()}>
              Confirmar rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de detalhes */}
      <Dialog open={!!profissionalDetalhes} onOpenChange={(open) => !open && setProfissionalDetalhes(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalhes do profissional</DialogTitle>
            <DialogDescription>Informações completas do profissional pendente de aprovação.</DialogDescription>
          </DialogHeader>
          {profissionalDetalhes && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-2">
                    <AvatarImage
                      src={profissionalDetalhes.avatar || "/placeholder.svg"}
                      alt={profissionalDetalhes.nome}
                    />
                    <AvatarFallback>{profissionalDetalhes.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{profissionalDetalhes.nome}</h3>
                  <p className="text-sm text-muted-foreground">{profissionalDetalhes.especialidade}</p>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Email</h4>
                      <p>{profissionalDetalhes.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Telefone</h4>
                      <p>{profissionalDetalhes.telefone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Documento</h4>
                      <p>{profissionalDetalhes.documento}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Data de cadastro</h4>
                      <p>{profissionalDetalhes.dataCadastro}</p>
                    </div>
                    {profissionalDetalhes.indicado && (
                      <div className="col-span-2">
                        <h4 className="text-sm font-medium">Indicado por</h4>
                        <p>{profissionalDetalhes.indicadoPor || "Não informado"}</p>
                      </div>
                    )}
                  </div>

                  {profissionalDetalhes.biografia && (
                    <div>
                      <h4 className="text-sm font-medium">Biografia</h4>
                      <p className="text-sm">{profissionalDetalhes.biografia}</p>
                    </div>
                  )}

                  {profissionalDetalhes.endereco && (
                    <div>
                      <h4 className="text-sm font-medium">Endereço</h4>
                      <p className="text-sm">
                        {profissionalDetalhes.endereco.rua}, {profissionalDetalhes.endereco.numero}
                        {profissionalDetalhes.endereco.complemento && `, ${profissionalDetalhes.endereco.complemento}`}{" "}
                        - {profissionalDetalhes.endereco.bairro}, {profissionalDetalhes.endereco.cidade}/
                        {profissionalDetalhes.endereco.estado} - CEP: {profissionalDetalhes.endereco.cep}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setProfissionalDetalhes(null)}>
              Fechar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setProfissionalParaRejeitar(profissionalDetalhes.id)
                setProfissionalDetalhes(null)
              }}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Rejeitar
            </Button>
            <Button
              variant="default"
              onClick={() => {
                handleAprovar(profissionalDetalhes.id)
                setProfissionalDetalhes(null)
              }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
