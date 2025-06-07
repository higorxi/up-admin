"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { profissionaisService } from "@/services/profissionais-service"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { UserPlus, MapPin, User, Link as LinkIcon } from "lucide-react"

const formSchema = z.object({
  // Dados do usuário
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter pelo menos 6 caracteres.",
  }),
  
  // Dados do profissional
  name: z.string().min(3, {
    message: "O nome deve ter pelo menos 3 caracteres.",
  }),
  profession: z.string().min(1, {
    message: "Selecione uma profissão.",
  }),
  document: z.string().optional(),
  generalRegister: z.string().optional(),
  registrationAgency: z.string().optional(),
  description: z.string().optional(),
  experience: z.string().optional(),
  officeName: z.string().optional(),
  phone: z.string().min(10, {
    message: "Telefone inválido.",
  }),
  
  // Dados de endereço
  zipCode: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().min(1, {
    message: "Bairro é obrigatório.",
  }),
  city: z.string().min(1, {
    message: "Cidade é obrigatória.",
  }),
  state: z.string().min(2, {
    message: "Estado é obrigatório.",
  }),
  
  // Campos adicionais (não enviados para o backend)
  indicadoPor: z.string().min(3, {
    message: "Informe quem indicou este profissional.",
  }),
  socialMedia: z.object({
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
    whatsapp: z.string().optional(),
  }),
  availableDays: z.array(z.string()).optional(),
})

// Dias da semana
const diasDaSemana = [
  { id: "segunda", label: "Segunda-feira" },
  { id: "terca", label: "Terça-feira" },
  { id: "quarta", label: "Quarta-feira" },
  { id: "quinta", label: "Quinta-feira" },
  { id: "sexta", label: "Sexta-feira" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
]

export function ProfissionalIndicadoForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [cepBuscando, setCepBuscando] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Dados do usuário
      email: "",
      password: "",
      
      // Dados do profissional
      name: "",
      profession: "",
      document: "",
      generalRegister: "",
      registrationAgency: "",
      description: "",
      experience: "",
      officeName: "",
      phone: "",
      
      // Dados de endereço
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
      
      // Campos adicionais
      indicadoPor: "",
      socialMedia: {
        instagram: "",
        linkedin: "",
        whatsapp: "",
      },
      availableDays: [],
    },
  })

  // Função para buscar endereço pelo CEP
  const buscarEnderecoPorCep = async (cep: string) => {
    if (cep.length < 8) return

    setCepBuscando(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (!data.erro) {
        form.setValue("street", data.logradouro || "")
        form.setValue("district", data.bairro || "")
        form.setValue("city", data.localidade || "")
        form.setValue("state", data.uf || "")
        toast({
          title: "CEP encontrado",
          description: "Endereço preenchido automaticamente.",
        })
      } else {
        toast({
          title: "CEP não encontrado",
          description: "Verifique o CEP informado.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error)
      toast({
        title: "Erro ao buscar CEP",
        description: "Tente novamente ou preencha manualmente.",
        variant: "destructive",
      })
    } finally {
      setCepBuscando(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      // Preparar dados no formato esperado pelo endpoint
      const professionalData = {
        name: values.name,
        profession: values.profession,
        document: values.document || undefined,
        generalRegister: values.generalRegister || undefined,
        registrationAgency: values.registrationAgency || undefined,
        description: values.description || undefined,
        experience: values.experience || undefined,
        officeName: values.officeName || undefined,
        phone: values.phone,
        verified: false,
        featured: false,
      }

      const userData = {
        email: values.email,
        password: values.password,
        address: {
          zipCode: values.zipCode || undefined,
          street: values.street || undefined,
          number: values.number || undefined,
          complement: values.complement || undefined,
          district: values.district,
          city: values.city,
          state: values.state,
        }
      }

      // Estrutura final que será enviada para o endpoint
      const payload = {
        professional: professionalData,
        user: userData,
        // Dados adicionais que podem ser armazenados localmente ou em outro serviço
        metadata: {
          indicadoPor: values.indicadoPor,
          socialMedia: values.socialMedia,
          availableDays: values.availableDays,
        }
      }

      await profissionaisService.cadastrarProfissionalIndicado(payload)
      
      toast({
        title: "Profissional indicado cadastrado",
        description: "O profissional indicado foi cadastrado com sucesso.",
      })
      
      router.push("/profissionais/indicados")
    } catch (error) {
      console.error("Erro ao cadastrar profissional:", error)
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
                  name="name"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Senha de acesso" {...field} />
                      </FormControl>
                      <FormDescription>
                        Senha para acesso do profissional ao sistema
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
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
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profissão</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma profissão" />
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
              </div>

              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento (CPF/CNPJ) - Opcional</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="generalRegister"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registro Profissional - Opcional</FormLabel>
                      <FormControl>
                        <Input placeholder="CRM, CRO, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="registrationAgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Órgão do Registro - Opcional</FormLabel>
                      <FormControl>
                        <Input placeholder="CRM-SP, CRO-RJ, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="officeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Consultório - Opcional</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da clínica/consultório" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Descrição</FormLabel>
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

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem className="mt-6">
                    <FormLabel>Experiência - Opcional</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Experiência profissional detalhada" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormDescription>
                      Informações detalhadas sobre a experiência do profissional.
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
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormLabel>CEP (opcional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="00000-000"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              const cep = e.target.value.replace(/\D/g, "")
                              if (cep.length === 8) {
                                buscarEnderecoPorCep(cep)
                              }
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
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rua (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da rua" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Apto 101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
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
                  name="city"
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
                  name="state"
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
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" />
                Redes Sociais
              </CardTitle>
              <CardDescription>Informações de contato e redes sociais do profissional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="socialMedia.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="@usuario" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialMedia.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="URL do perfil LinkedIn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="socialMedia.whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número de WhatsApp para contato profissional
                      </FormDescription>
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
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Dias Disponíveis</CardTitle>
              <CardDescription>Selecione os dias em que o profissional atende</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {diasDaSemana.map((dia) => (
                  <FormField
                    key={dia.id}
                    control={form.control}
                    name="availableDays"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(dia.id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), dia.id]
                                : (field.value || []).filter((value) => value !== dia.id)
                              field.onChange(updatedValue)
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer">{dia.label}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
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