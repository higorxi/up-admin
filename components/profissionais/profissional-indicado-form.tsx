"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { profissionaisService } from "@/services/profissionais-service"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { lojasService } from "@/services/lojas-service"
import { motion } from "framer-motion"
import { UserPlus, MapPin, User } from "lucide-react"

const formSchema = z.object({
  nome: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  telefone: z.string().min(10, {
    message: "Telefone inválido.",
  }),
  especialidade: z.string().min(1, {
    message: "Selecione uma especialidade.",
  }),
  documento: z.string().min(1, {
    message: "Documento é obrigatório.",
  }),
  biografia: z.string().optional(),
  indicadoPor: z.string().min(3, {
    message: "Informe quem indicou este profissional.",
  }),
  lojaId: z.string().optional(),
  endereco: z.object({
    cep: z.string().min(8, {
      message: "CEP inválido.",
    }),
    rua: z.string().min(1, {
      message: "Rua é obrigatória.",
    }),
    numero: z.string().min(1, {
      message: "Número é obrigatório.",
    }),
    complemento: z.string().optional(),
    bairro: z.string().min(1, {
      message: "Bairro é obrigatório.",
    }),
    cidade: z.string().min(1, {
      message: "Cidade é obrigatória.",
    }),
    estado: z.string().min(2, {
      message: "Estado é obrigatório.",
    }),
  }),
})

export function ProfissionalIndicadoForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [lojas, setLojas] = useState([])
  const [loadingLojas, setLoadingLojas] = useState(false)
  const [cepBuscando, setCepBuscando] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      especialidade: "",
      documento: "",
      biografia: "",
      indicadoPor: "",
      lojaId: "",
      endereco: {
        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",
      },
    },
  })

  useEffect(() => {
    const carregarLojas = async () => {
      setLoadingLojas(true)
      try {
        const data = await lojasService.listarLojas()
        setLojas(data.filter((loja) => loja.status === "Ativa"))
      } catch (error) {
        console.error("Erro ao carregar lojas:", error)
      } finally {
        setLoadingLojas(false)
      }
    }

    carregarLojas()
  }, [])

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCep = async (cep: string) => {
    if (cep.length < 8) return

    setCepBuscando(true)
    try {
      // Simulando busca de CEP - em produção, use uma API real
      // const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      // const data = await response.json();

      // Simulando resposta para desenvolvimento
      setTimeout(() => {
        if (cep === "12345678") {
          form.setValue("endereco.rua", "Avenida Exemplo")
          form.setValue("endereco.bairro", "Centro")
          form.setValue("endereco.cidade", "São Paulo")
          form.setValue("endereco.estado", "SP")
          toast({
            title: "CEP encontrado",
            description: "Endereço preenchido automaticamente.",
          })
        }
        setCepBuscando(false)
      }, 800)
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      setCepBuscando(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      // Adiciona a flag de indicado como true
      const dadosProfissional = {
        ...values,
        indicado: true,
      }

      await profissionaisService.cadastrarProfissional(dadosProfissional)
      toast({
        title: "Profissional indicado cadastrado",
        description: "O profissional indicado foi cadastrado com sucesso.",
      })
      router.push("/profissionais/indicados")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao cadastrar o profissional indicado.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>Dados básicos do profissional indicado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do profissional" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="especialidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Especialidade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma especialidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Médico">Médico</SelectItem>
                          <SelectItem value="Dentista">Dentista</SelectItem>
                          <SelectItem value="Fisioterapeuta">Fisioterapeuta</SelectItem>
                          <SelectItem value="Nutricionista">Nutricionista</SelectItem>
                          <SelectItem value="Psicólogo">Psicólogo</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento (CPF/CNPJ)</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="indicadoPor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicado Por</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome de quem indicou" {...field} />
                      </FormControl>
                      <FormDescription>
                        Informe o nome da pessoa ou entidade que indicou este profissional.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lojaId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loja</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma loja (opcional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingLojas ? (
                            <SelectItem value="loading" disabled>
                              Carregando lojas...
                            </SelectItem>
                          ) : (
                            <>
                              <SelectItem value="none">Nenhuma loja</SelectItem>
                              {lojas.map((loja) => (
                                <SelectItem key={loja.id} value={loja.id}>
                                  {loja.nome}
                                </SelectItem>
                              ))}
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>Associe o profissional a uma loja (opcional)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="biografia"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Biografia</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Informações sobre o profissional" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormDescription>
                      Breve descrição sobre a experiência e qualificações do profissional.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Endereço
              </CardTitle>
              <CardDescription>Informações de localização do profissional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="endereco.cep"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="00000-000"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              buscarEnderecoPorCep(e.target.value.replace(/\D/g, ""))
                            }}
                            className={cepBuscando ? "pr-10" : ""}
                          />
                          {cepBuscando && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>Digite o CEP para buscar o endereço automaticamente</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endereco.rua"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da rua" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endereco.numero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endereco.complemento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input placeholder="Apto 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endereco.bairro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endereco.cidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endereco.estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="AC">Acre</SelectItem>
                          <SelectItem value="AL">Alagoas</SelectItem>
                          <SelectItem value="AP">Amapá</SelectItem>
                          <SelectItem value="AM">Amazonas</SelectItem>
                          <SelectItem value="BA">Bahia</SelectItem>
                          <SelectItem value="CE">Ceará</SelectItem>
                          <SelectItem value="DF">Distrito Federal</SelectItem>
                          <SelectItem value="ES">Espírito Santo</SelectItem>
                          <SelectItem value="GO">Goiás</SelectItem>
                          <SelectItem value="MA">Maranhão</SelectItem>
                          <SelectItem value="MT">Mato Grosso</SelectItem>
                          <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                          <SelectItem value="MG">Minas Gerais</SelectItem>
                          <SelectItem value="PA">Pará</SelectItem>
                          <SelectItem value="PB">Paraíba</SelectItem>
                          <SelectItem value="PR">Paraná</SelectItem>
                          <SelectItem value="PE">Pernambuco</SelectItem>
                          <SelectItem value="PI">Piauí</SelectItem>
                          <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                          <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                          <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                          <SelectItem value="RO">Rondônia</SelectItem>
                          <SelectItem value="RR">Roraima</SelectItem>
                          <SelectItem value="SC">Santa Catarina</SelectItem>
                          <SelectItem value="SP">São Paulo</SelectItem>
                          <SelectItem value="SE">Sergipe</SelectItem>
                          <SelectItem value="TO">Tocantins</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-end gap-4"
        >
          <Button variant="outline" type="button" onClick={() => router.push("/profissionais/indicados")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="gap-2">
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Cadastrar</span>
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  )
}
