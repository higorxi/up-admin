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
import { lojasService } from "@/services/lojas-service"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  nome: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  cnpj: z.string().min(14, {
    message: "CNPJ inválido.",
  }),
  telefone: z.string().min(10, {
    message: "Telefone inválido.",
  }),
  email: z
    .string()
    .email({
      message: "Email inválido.",
    })
    .optional()
    .or(z.literal("")),
  descricao: z.string().optional(),
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

export function LojaForm({ id }: { id?: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cnpj: "",
      telefone: "",
      email: "",
      descricao: "",
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
    if (id) {
      const carregarLoja = async () => {
        try {
          const loja = await lojasService.obterLojaPorId(id)
          if (loja) {
            form.reset({
              nome: loja.nome,
              cnpj: loja.cnpj,
              telefone: loja.telefone || "",
              email: loja.email || "",
              descricao: loja.descricao || "",
              endereco: loja.endereco || {
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
            description: "Não foi possível carregar os dados da loja.",
            variant: "destructive",
          })
        }
      }

      carregarLoja()
    }
  }, [id, form])

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      if (id) {
        await lojasService.atualizarLoja(id, values)
        toast({
          title: "Loja atualizada",
          description: "As informações da loja foram atualizadas com sucesso.",
        })
      } else {
        await lojasService.cadastrarLoja(values)
        toast({
          title: "Loja cadastrada",
          description: "A loja foi cadastrada com sucesso.",
        })
      }
      router.push("/fornecedores-parceiros")
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar a loja.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
                    <FormLabel>Nome da Loja</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da loja" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="00.000.000/0001-00" {...field} />
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
                      <Input placeholder="(00) 0000-0000" {...field} />
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
                      <Input placeholder="contato@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Informações sobre a loja" className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormDescription>Breve descrição sobre a loja, serviços oferecidos, etc.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      <Input placeholder="Sala 101" {...field} />
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
          <Button variant="outline" type="button" onClick={() => router.push("/fornecedores-parceiros")}>
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
