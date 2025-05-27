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
import { lojasService } from "@/services/lojas-service"
import Loading from "../loading"

// Tipagens
interface PartnerSupplier {
  id: string
  tradeName: string
  companyName: string
  document: string
  stateRegistration: string | null
  contact: string
  profileImage: string | null
  accessPending: boolean
  storeId: string | null
}

interface ApiResponse {
  id: string
  email: string
  password: string
  createdAt: string
  updatedAt: string
  professionalId: string | null
  partnerSupplierId: string
  loveDecorationId: string | null
  partnerSupplier: PartnerSupplier
}

export interface FornecedorParceiro {
  id: string
  email: string
  createdAt: string
  updatedAt: string
  fornecedorId: string
  nomeFantasia: string
  razaoSocial: string
  documento: string
  inscricaoEstadual: string | null
  contato: string
  imagemPerfil: string | null
  acessoPendente: boolean
  dataCadastro: string
}

export function AprovacaoList() {
  const [fornecedoresParceiros, setFornecedoresParceiros] = useState<FornecedorParceiro[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [motivoRejeicao, setMotivoRejeicao] = useState<string>("")
  const [fornecedorParaRejeitar, setFornecedorParaRejeitar] = useState<string | null>(null)
  const [fornecedorDetalhes, setFornecedorDetalhes] = useState<FornecedorParceiro | null>(null)

  useEffect(() => {
    const carregarFornecedoresParceiros = async (): Promise<void> => {
      try {
        const data: ApiResponse[] = await lojasService.listarLojasParceirasPendentes()
        
        // Desestruturando o JSON recebido
        const fornecedoresFormatados: FornecedorParceiro[] = data.map((item: ApiResponse) => ({
          id: item.id,
          email: item.email,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          // Dados do fornecedor parceiro
          fornecedorId: item.partnerSupplier.id,
          nomeFantasia: item.partnerSupplier.tradeName,
          razaoSocial: item.partnerSupplier.companyName,
          documento: item.partnerSupplier.document,
          inscricaoEstadual: item.partnerSupplier.stateRegistration,
          contato: item.partnerSupplier.contact,
          imagemPerfil: item.partnerSupplier.profileImage,
          acessoPendente: item.partnerSupplier.accessPending,
          // Formatação da data
          dataCadastro: new Date(item.createdAt).toLocaleDateString('pt-BR'),
        }))
        
        setFornecedoresParceiros(fornecedoresFormatados)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os fornecedores parceiros pendentes.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    carregarFornecedoresParceiros()
  }, [])

  const handleAprovar = async (id: string): Promise<void> => {
    try {
      await lojasService.atualizarPendenciaFornecedor(id, false)
      setFornecedoresParceiros(fornecedoresParceiros.filter((f) => f.fornecedorId !== id))
      toast({
        title: "Fornecedor parceiro aprovado",
        description: "O fornecedor parceiro foi aprovado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao aprovar o fornecedor parceiro.",
        variant: "destructive",
      })
    }
  }

  const handleRejeitar = async (id: string): Promise<void> => {

    try {
      await lojasService.atualizarPendenciaFornecedor(id, true)
      setFornecedoresParceiros(fornecedoresParceiros.filter((f) => f.fornecedorId !== id))
      toast({
        title: "Fornecedor parceiro rejeitado",
        description: "O fornecedor parceiro foi rejeitado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao rejeitar o fornecedor parceiro.",
        variant: "destructive",
      })
    } finally {
      setFornecedorParaRejeitar(null)
      setMotivoRejeicao("")
    }
  }

  const abrirDetalhes = (fornecedor: FornecedorParceiro): void => {
    setFornecedorDetalhes(fornecedor)
  }


  if (loading) {
    return <Loading text="Carregando fornecedores parceiros..."/>
  }


  if (fornecedoresParceiros.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-center space-y-2">
            <h3 className="text-lg sm:text-xl font-medium">Nenhum fornecedor parceiro pendente</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Não há fornecedores parceiros aguardando aprovação no momento.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full">
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {fornecedoresParceiros.map((fornecedor) => (
          <Card key={fornecedor.id} className="w-full">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                <Badge variant="warning" className="w-fit">Pendente</Badge>
                <div className="text-xs text-muted-foreground">{fornecedor.dataCadastro}</div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mb-2">
                  <AvatarImage src={fornecedor.imagemPerfil || undefined} alt={fornecedor.nomeFantasia} />
                  <AvatarFallback className="text-lg">{fornecedor.nomeFantasia?.charAt(0) || 'F'}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg sm:text-xl leading-tight">{fornecedor.nomeFantasia}</CardTitle>
                <CardDescription className="text-sm text-center break-words">{fornecedor.razaoSocial}</CardDescription>
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium">Email:</span>
                  <span className="text-right break-all">{fornecedor.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium">Contato:</span>
                  <span className="text-right">{fornecedor.contato}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                  <span className="font-medium">CNPJ:</span>
                  <span className="text-right font-mono">{fornecedor.documento}</span>
                </div>
                {fornecedor.inscricaoEstadual && (
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                    <span className="font-medium">Insc. Estadual:</span>
                    <span className="text-right">{fornecedor.inscricaoEstadual}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 p-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => abrirDetalhes(fornecedor)}
                className="w-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalhes
              </Button>
              <div className="flex gap-2 w-full">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleRejeitar(fornecedor.fornecedorId)}
                  className="flex-1 min-w-0"
                >
                  <XCircle className="mr-1 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Rejeitar</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleAprovar(fornecedor.fornecedorId)}
                  className="flex-1 min-w-0"
                >
                  <CheckCircle className="mr-1 h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Aprovar</span>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Modal de detalhes */}
      <Dialog open={!!fornecedorDetalhes} onOpenChange={(open) => !open && setFornecedorDetalhes(null)}>
        <DialogContent className="w-[95vw] max-w-4xl mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Detalhes do fornecedor parceiro</DialogTitle>
            <DialogDescription className="text-sm">
              Informações completas do fornecedor parceiro pendente de aprovação.
            </DialogDescription>
          </DialogHeader>
          {fornecedorDetalhes && (
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex flex-col items-center lg:items-start">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 mb-2">
                    <AvatarImage
                      src={fornecedorDetalhes.imagemPerfil || undefined}
                      alt={fornecedorDetalhes.nomeFantasia}
                    />
                    <AvatarFallback className="text-xl">{fornecedorDetalhes.nomeFantasia?.charAt(0) || 'F'}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-center lg:text-left">{fornecedorDetalhes.nomeFantasia}</h3>
                  <p className="text-sm text-muted-foreground text-center lg:text-left break-words max-w-xs">{fornecedorDetalhes.razaoSocial}</p>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Email</h4>
                      <p className="text-sm break-all">{fornecedorDetalhes.email}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Contato</h4>
                      <p className="text-sm">{fornecedorDetalhes.contato}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">CNPJ</h4>
                      <p className="text-sm font-mono">{fornecedorDetalhes.documento}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Data de cadastro</h4>
                      <p className="text-sm">{fornecedorDetalhes.dataCadastro}</p>
                    </div>
                    {fornecedorDetalhes.inscricaoEstadual && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Inscrição Estadual</h4>
                        <p className="text-sm">{fornecedorDetalhes.inscricaoEstadual}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Nome Fantasia</h4>
                      <p className="text-sm">{fornecedorDetalhes.nomeFantasia}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Razão Social</h4>
                      <p className="text-sm break-words">{fornecedorDetalhes.razaoSocial}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => setFornecedorDetalhes(null)}
              className="w-full sm:w-auto"
            >
              Fechar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleRejeitar(fornecedorDetalhes!.fornecedorId)
                setFornecedorDetalhes(null)
              }}
              className="w-full sm:w-auto"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Rejeitar
            </Button>
            <Button
              variant="default"
              onClick={() => {
                handleAprovar(fornecedorDetalhes!.fornecedorId)
                setFornecedorDetalhes(null)
              }}
              className="w-full sm:w-auto"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}