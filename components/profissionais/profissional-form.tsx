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
import { Card, CardContent } from "@/components/ui/card"
import { profissionaisService } from "@/services/profissionais-service"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { lojasService } from "@/services/lojas-service"

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
  indicado: z.boolean().default(false),
  indicadoPor: z.string().optional(),
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

export function ProfissionalForm({ id }: { id?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [lojas, setLojas] = useState([])
  const [loadingLojas, setLoadingLojas] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      especialidade: "",
      documento: "",
      biografia: "",
      indicado: false,
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

  const isIndicado = form.watch("indicado")

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

    if (id) {
      const carregarProfissional = async () => {
        try {
          const profissional = await profissionaisService.obterProfissionalPorId(id)
          if (profissional) {
            form.reset({
              nome: profissional.nome,
              email: profissional.email,
              telefone: profissional.telefone || "",
              especialidade: profissional.especialidade,
              documento: profissional.documento || "",
              biografia: profissional.biografia || "",
              indicado: profissional.indicado || false,
              indicadoPor: profissional.indicadoPor || "",
              lojaId: profissional.lojaId || "",
              endereco: profissional.endereco || {
                cep: "",
                rua: "",
                numero: "",
                complemento: "",
                bairro: "",
                cidade: "",
                estado: "",
              },
            })
          }
        } catch (error) {
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados do profissional.",
            variant: "destructive",
          })
        }
      }

      carregarProfissional()
    }
  }, [id, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      if (id) {
        await profissionaisService.atualizarProfissional(id, values)
        toast({
          title: "Profissional atualizado",
          description: "As informações do profissional foram atualizadas com sucesso.",
        })
      } else {
        await profissionaisService.cadastrarProfissional(values)
        toast({
          title: "Profissional cadastrado",
          description: "O profissional foi cadastrado com sucesso.",
        })
      }
      router.push("/profissionais")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o profissional.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCep = async (cep: string) => {
    if (cep.length < 8) return

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
        }
      }, 500)
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
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

            <div className="mt-6 space-y-4">
              <FormField
                control={form.control}
                name="indicado"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Profissional Indicado</FormLabel>
                      <FormDescription>Marque esta opção se o profissional foi indicado por alguém.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {isIndicado && (
                <FormField
                  control={form.control}
                  name="indicadoPor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Indicado por</FormLabel>
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
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Endereço</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="endereco.cep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="00000-000"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          buscarEnderecoPorCep(e.target.value.replace(/\D/g, ""))
                        }}
                      />
                    </FormControl>
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

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/profissionais")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : id ? "Atualizar" : "Cadastrar"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
