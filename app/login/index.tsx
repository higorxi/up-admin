"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Lock,
  User,
  AlertCircle,
  ArrowLeft,
  Mail,
  UserPlus,
  Check,
  Briefcase,
  LogIn,
  UserCircle2,
  Building2,
  Phone,
  CreditCard,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")
  const [registerType, setRegisterType] = useState<"professional" | "company">("professional")
  const isMobile = false;
  const [mounted, setMounted] = useState(false)

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    senha: "",
  })
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoginLoading, setIsLoginLoading] = useState(false)

  // Professional Register state
  const [professionalData, setProfessionalData] = useState({
    nome: "",
    email: "",
    telefone: "",
    profissao: "",
    senha: "",
    confirmarSenha: "",
  })

  // Company Register state
  const [companyData, setCompanyData] = useState({
    nomeEmpresa: "",
    cnpj: "",
    segmento: "",
    nomeResponsavel: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  })

  const [registerError, setRegisterError] = useState<string | null>(null)
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  // Login handlers
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
    if (loginError) setLoginError(null)
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoginLoading(true)

    // Simulando um tempo de carregamento
    setTimeout(() => {
      // Validação das credenciais fixas
      if (loginData.email === "usuario@email.com" && loginData.senha === "senha123") {
        // Login bem-sucedido - redirecionaria para a página principal
        window.opener?.postMessage({ type: "LOGIN_SUCCESS" }, "*")
        router.push("/")
      } else {
        // Login falhou
        toast.error("Email ou senha incorretos. Tente novamente.")
        setIsLoginLoading(false)
      }
    }, 1000)
  }

  // Professional Register handlers
  const handleProfessionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfessionalData((prev) => ({ ...prev, [name]: value }))
    if (registerError) setRegisterError(null)
  }

  const handleProfessionalSelectChange = (value: string) => {
    setProfessionalData((prev) => ({ ...prev, profissao: value }))
  }

  // Company Register handlers
  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCompanyData((prev) => ({ ...prev, [name]: value }))
    if (registerError) setRegisterError(null)
  }

  const handleCompanySelectChange = (value: string) => {
    setCompanyData((prev) => ({ ...prev, segmento: value }))
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegisterLoading(true)

    // Dados do formulário atual
    const formData = registerType === "professional" ? professionalData : companyData

    // Validação básica
    if (formData.senha !== formData.confirmarSenha) {
      setRegisterError("As senhas não coincidem.")
      setIsRegisterLoading(false)
      return
    }

    // Simulando um tempo de carregamento e registro
    setTimeout(() => {
      console.log(`Dados de registro (${registerType}):`, formData)
      setRegisterSuccess(true)
      setIsRegisterLoading(false)

      // Após 2 segundos, muda para a aba de login
      setTimeout(() => {
        setActiveTab("login")
        setRegisterSuccess(false)
        // Preenche o email no login
        setLoginData((prev) => ({
          ...prev,
          email: registerType === "professional" ? professionalData.email : companyData.email,
        }))
      }, 2000)
    }, 1500)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 bg-background">
         <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="container py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar para o site</span>
          </Link>
          <div className="flex items-center gap-2 font-bold text-xl">
            <span className="text-primary">UP</span>
            <span className="text-foreground">Connection</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container flex items-center justify-center py-8 ">
        <div
          className={cn(
            "flex w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-border/50",
            isMobile ? "flex-col" : "flex-row h-[600px]",
          )}
        >
          {/* Sidebar with tabs */}
          <div
            className={cn(
              "bg-gradient-to-b from-primary/20 to-secondary/20 backdrop-blur-sm",
              isMobile ? "w-full p-4" : "w-1/3 p-8",
            )}
          >
 

            <h2 className={cn("text-2xl font-bold mb-6 text-center mt-24", isMobile ? "hidden" : "block")}>
              Bem-vindo ao UP Connection
            </h2>

            <div className={cn("space-y-4", isMobile ? "flex space-y-0 gap-4" : "block")}>
              <button
                onClick={() => setActiveTab("login")}
                className={cn(
                  "w-full group flex items-center gap-3 p-4 rounded-lg transition-all duration-300",
                  activeTab === "login"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card/30 text-foreground hover:bg-card/50",
                  isMobile ? "justify-center flex-1" : "",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300",
                    activeTab === "login" ? "bg-primary-foreground/20" : "bg-primary/20 group-hover:bg-primary/30",
                  )}
                >
                  <LogIn
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      activeTab === "login" ? "text-primary-foreground" : "text-primary",
                    )}
                  />
                </div>
                <div className={isMobile ? "hidden" : "block"}>
                  <p className="font-medium text-lg">Login</p>
                  <p
                    className={cn(
                      "text-xs",
                      activeTab === "login" ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    Acesse sua conta
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("register")}
                className={cn(
                  "w-full group flex items-center gap-3 p-4 rounded-lg transition-all duration-300",
                  activeTab === "register"
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card/30 text-foreground hover:bg-card/50",
                  isMobile ? "justify-center flex-1" : "",
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center h-10 w-10 rounded-full transition-all duration-300",
                    activeTab === "register" ? "bg-primary-foreground/20" : "bg-primary/20 group-hover:bg-primary/30",
                  )}
                >
                  <UserPlus
                    className={cn(
                      "h-5 w-5 transition-all duration-300",
                      activeTab === "register" ? "text-primary-foreground" : "text-primary",
                    )}
                  />
                </div>
                <div className={isMobile ? "hidden" : "block"}>
                  <p className="font-medium text-lg">Cadastro</p>
                  <p
                    className={cn(
                      "text-xs",
                      activeTab === "register" ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    Crie sua conta
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className={cn("bg-card/50 backdrop-blur-sm", isMobile ? "w-full p-6" : "w-2/3 p-8")}>
            <div className="h-full flex flex-col">
              {/* Login Form */}
              {activeTab === "login" && (
                <div className="flex-1">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">Acesse sua conta</h1>
                    <p className="text-muted-foreground">Entre com suas credenciais para acessar</p>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    {loginError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <div className="relative">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={loginData.email}
                            onChange={handleLoginChange}
                            className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                            placeholder="seu@email.com"
                            required
                          />
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="senha" className="text-sm font-medium">
                            Senha
                          </Label>
                          <Button variant="link" className="h-auto p-0 text-xs" type="button">
                            Esqueceu a senha?
                          </Button>
                        </div>
                        <div className="relative">
                          <Input
                            id="senha"
                            name="senha"
                            type="password"
                            value={loginData.senha}
                            onChange={handleLoginChange}
                            className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                            required
                          />
                          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading ? "Entrando..." : "Entrar"}
                    </Button>

                    <div className="text-center text-sm">
                      <span className="text-muted-foreground">Não tem uma conta?</span>{" "}
                      <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("register")}>
                        Cadastre-se
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Register Form */}
              {activeTab === "register" && (
                <div className="flex-1 overflow-auto pr-5">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">Crie sua conta</h1>
                    <p className="text-muted-foreground">Escolha o tipo de cadastro</p>
                  </div>

                  {/* Register Type Selector */}
                  <div className="flex gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setRegisterType("professional")}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-300",
                        registerType === "professional"
                          ? "bg-primary/20 border-primary shadow-md"
                          : "bg-card/30 border-border/50 hover:bg-card/50",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center h-12 w-12 rounded-full",
                          registerType === "professional" ? "bg-primary/30" : "bg-primary/10",
                        )}
                      >
                        <User
                          className={cn(
                            "h-6 w-6",
                            registerType === "professional" ? "text-primary-foreground" : "text-primary",
                          )}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Profissional</p>
                        <p className="text-xs text-muted-foreground">Pessoa física</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegisterType("company")}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-2 p-4 rounded-lg border transition-all duration-300",
                        registerType === "company"
                          ? "bg-primary/20 border-primary shadow-md"
                          : "bg-card/30 border-border/50 hover:bg-card/50",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center h-12 w-12 rounded-full",
                          registerType === "company" ? "bg-primary/30" : "bg-primary/10",
                        )}
                      >
                        <Building2
                          className={cn(
                            "h-6 w-6",
                            registerType === "company" ? "text-primary-foreground" : "text-primary",
                          )}
                        />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">Empresa</p>
                        <p className="text-xs text-muted-foreground">Pessoa jurídica</p>
                      </div>
                    </button>
                  </div>

                  {registerError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{registerError}</AlertDescription>
                    </Alert>
                  )}

                  {registerSuccess && (
                    <Alert className="mb-4 bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/50">
                      <Check className="h-4 w-4" />
                      <AlertDescription>
                        Cadastro realizado com sucesso! Redirecionando para o login...
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Professional Registration Form */}
                  {registerType === "professional" && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="nome" className="text-sm font-medium">
                            Nome Completo
                          </Label>
                          <div className="relative">
                            <Input
                              id="nome"
                              name="nome"
                              type="text"
                              value={professionalData.nome}
                              onChange={handleProfessionalChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="Seu nome completo"
                              required
                              disabled={registerSuccess}
                            />
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="professional-email" className="text-sm font-medium">
                            Email
                          </Label>
                          <div className="relative">
                            <Input
                              id="professional-email"
                              name="email"
                              type="email"
                              value={professionalData.email}
                              onChange={handleProfessionalChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="seu@email.com"
                              required
                              disabled={registerSuccess}
                            />
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="professional-telefone" className="text-sm font-medium">
                            Telefone
                          </Label>
                          <div className="relative">
                            <Input
                              id="professional-telefone"
                              name="telefone"
                              type="tel"
                              value={professionalData.telefone}
                              onChange={handleProfessionalChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="(00) 00000-0000"
                              required
                              disabled={registerSuccess}
                            />
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="profissao" className="text-sm font-medium">
                            Profissão
                          </Label>
                          <div className="relative">
                            <Select
                              value={professionalData.profissao}
                              onValueChange={handleProfessionalSelectChange}
                              disabled={registerSuccess}
                            >
                              <SelectTrigger className="pl-10 bg-card/50 border-border/50 focus:border-primary">
                                <SelectValue placeholder="Selecione sua profissão" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="arquiteto">Arquiteto(a)</SelectItem>
                                <SelectItem value="designer">Designer de Interiores</SelectItem>
                                <SelectItem value="engenheiro">Engenheiro(a)</SelectItem>
                                <SelectItem value="paisagista">Paisagista</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                            <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="professional-senha" className="text-sm font-medium">
                            Senha
                          </Label>
                          <div className="relative">
                            <Input
                              id="professional-senha"
                              name="senha"
                              type="password"
                              value={professionalData.senha}
                              onChange={handleProfessionalChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              required
                              disabled={registerSuccess}
                            />
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="professional-confirmarSenha" className="text-sm font-medium">
                            Confirmar Senha
                          </Label>
                          <div className="relative">
                            <Input
                              id="professional-confirmarSenha"
                              name="confirmarSenha"
                              type="password"
                              value={professionalData.confirmarSenha}
                              onChange={handleProfessionalChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              required
                              disabled={registerSuccess}
                            />
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                        disabled={isRegisterLoading || registerSuccess}
                      >
                        {isRegisterLoading ? "Cadastrando..." : "Cadastrar como Profissional"}
                      </Button>
                    </form>
                  )}

                  {/* Company Registration Form */}
                  {registerType === "company" && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="nomeEmpresa" className="text-sm font-medium">
                            Nome da Empresa
                          </Label>
                          <div className="relative">
                            <Input
                              id="nomeEmpresa"
                              name="nomeEmpresa"
                              type="text"
                              value={companyData.nomeEmpresa}
                              onChange={handleCompanyChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="Nome da sua empresa"
                              required
                              disabled={registerSuccess}
                            />
                            <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cnpj" className="text-sm font-medium">
                            CNPJ
                          </Label>
                          <div className="relative">
                            <Input
                              id="cnpj"
                              name="cnpj"
                              type="text"
                              value={companyData.cnpj}
                              onChange={handleCompanyChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="00.000.000/0000-00"
                              required
                              disabled={registerSuccess}
                            />
                            <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="segmento" className="text-sm font-medium">
                            Segmento
                          </Label>
                          <div className="relative">
                            <Select
                              value={companyData.segmento}
                              onValueChange={handleCompanySelectChange}
                              disabled={registerSuccess}
                            >
                              <SelectTrigger className="pl-10 bg-card/50 border-border/50 focus:border-primary">
                                <SelectValue placeholder="Selecione o segmento" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="arquitetura">Escritório de Arquitetura</SelectItem>
                                <SelectItem value="design">Design de Interiores</SelectItem>
                                <SelectItem value="construcao">Construção Civil</SelectItem>
                                <SelectItem value="moveis">Móveis e Decoração</SelectItem>
                                <SelectItem value="paisagismo">Paisagismo</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                            <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="nomeResponsavel" className="text-sm font-medium">
                            Nome do Responsável
                          </Label>
                          <div className="relative">
                            <Input
                              id="nomeResponsavel"
                              name="nomeResponsavel"
                              type="text"
                              value={companyData.nomeResponsavel}
                              onChange={handleCompanyChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="Nome do responsável pela empresa"
                              required
                              disabled={registerSuccess}
                            />
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company-email" className="text-sm font-medium">
                            Email
                          </Label>
                          <div className="relative">
                            <Input
                              id="company-email"
                              name="email"
                              type="email"
                              value={companyData.email}
                              onChange={handleCompanyChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="contato@suaempresa.com.br"
                              required
                              disabled={registerSuccess}
                            />
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company-telefone" className="text-sm font-medium">
                            Telefone
                          </Label>
                          <div className="relative">
                            <Input
                              id="company-telefone"
                              name="telefone"
                              type="tel"
                              value={companyData.telefone}
                              onChange={handleCompanyChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              placeholder="(00) 00000-0000"
                              required
                              disabled={registerSuccess}
                            />
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company-senha" className="text-sm font-medium">
                            Senha
                          </Label>
                          <div className="relative">
                            <Input
                              id="company-senha"
                              name="senha"
                              type="password"
                              value={companyData.senha}
                              onChange={handleCompanyChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              required
                              disabled={registerSuccess}
                            />
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company-confirmarSenha" className="text-sm font-medium">
                            Confirmar Senha
                          </Label>
                          <div className="relative">
                            <Input
                              id="company-confirmarSenha"
                              name="confirmarSenha"
                              type="password"
                              value={companyData.confirmarSenha}
                              onChange={handleCompanyChange}
                              className="pl-10 bg-card/50 border-border/50 focus:border-primary"
                              required
                              disabled={registerSuccess}
                            />
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
                        disabled={isRegisterLoading || registerSuccess}
                      >
                        {isRegisterLoading ? "Cadastrando..." : "Cadastrar como Empresa"}
                      </Button>
                    </form>
                  )}

                  <div className="text-center text-sm mt-6">
                    <span className="text-muted-foreground">Já tem uma conta?</span>{" "}
                    <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("login")}>
                      Faça login
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} UP Connection. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
