"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Lock,
  User,
  AlertCircle,
  Shield,
  Key,
  Eye,
  EyeOff,
  CheckCircle
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AdminLoginPage() {
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showKeyword, setShowKeyword] = useState(false)

  // Login state
  const [loginData, setLoginData] = useState({
    cpf: "",
    senha: "",
    palavraChave: "",
  })
  
  const [loginError, setLoginError] = useState(null)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  // Função para formatar CPF
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  // Login handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target
    
    if (name === 'cpf') {
      const formattedCPF = formatCPF(value)
      if (formattedCPF.length <= 14) {
        setLoginData((prev) => ({ ...prev, [name]: formattedCPF }))
      }
    } else {
      setLoginData((prev) => ({ ...prev, [name]: value }))
    }
    
    if (loginError) setLoginError(null)
  }

  const validateCPF = (cpf) => {
    const numbers = cpf.replace(/\D/g, '')
    return numbers.length === 11
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setIsLoginLoading(true)
    setLoginError(null)

    // Validações básicas
    if (!validateCPF(loginData.cpf)) {
      setLoginError("CPF deve conter 11 dígitos válidos")
      setIsLoginLoading(false)
      return
    }

    if (loginData.senha.length < 6) {
      setLoginError("Senha deve ter pelo menos 6 caracteres")
      setIsLoginLoading(false)
      return
    }

    if (loginData.palavraChave.length < 3) {
      setLoginError("Palavra-chave deve ter pelo menos 3 caracteres")
      setIsLoginLoading(false)
      return
    }

    try {
      // Simulando uma requisição real
      const requestBody = {
        cpf: loginData.cpf.replace(/\D/g, ''), // Remove formatação
        senha: loginData.senha,
        palavraChave: loginData.palavraChave.toLowerCase().trim()
      }

      console.log('Enviando dados para autenticação:', requestBody)

      // Simulando delay da requisição
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulando validação (substitua pela sua lógica real)
      const validCredentials = {
        cpf: '12345678901',
        senha: 'admin123',
        palavraChave: 'sistema'
      }

      if (
        requestBody.cpf === validCredentials.cpf &&
        requestBody.senha === validCredentials.senha &&
        requestBody.palavraChave === validCredentials.palavraChave
      ) {
        // Login bem-sucedido
        setLoginSuccess(true)
        
        // Aqui você faria a requisição real para sua API
        // const response = await fetch('/api/admin/login', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(requestBody)
        // })
        
        // const result = await response.json()
        
        // if (response.ok) {
        //   localStorage.setItem('adminToken', result.token)
        //   window.location.href = '/admin/dashboard'
        // }

        // Simulando redirecionamento após 2 segundos
        setTimeout(() => {
          console.log('Redirecionando para painel administrativo...')
          window.location.href = '/dashboard'
        }, 1000)
        
      } else {
        throw new Error('Credenciais inválidas')
      }
      
    } catch (error) {
      setLoginError(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setIsLoginLoading(false)
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Main login card */}
      <div className="w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Acesso Administrativo</h1>
            <p className="text-blue-200/80">Sistema de Gerenciamento</p>
          </div>

          {/* Success Alert */}
          {loginSuccess && (
            <Alert className="mb-6 bg-green-500/20 text-green-300 border-green-500/50">
              <CheckCircle className="h-4 w-6" />
              <AlertDescription>
                Login realizado com sucesso! Redirecionando...
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {loginError && (
            <Alert variant="destructive" className="mb-6 bg-red-500/20 text-red-300 border-red-500/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* CPF Field */}
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium text-white">
                CPF do Administrador
              </Label>
              <div className="relative">
                <Input
                  id="cpf"
                  name="cpf"
                  type="text"
                  value={loginData.cpf}
                  onChange={handleLoginChange}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                  disabled={isLoginLoading || loginSuccess}
                />
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-sm font-medium text-white">
                Senha de Acesso
              </Label>
              <div className="relative">
                <Input
                  id="senha"
                  name="senha"
                  type={showPassword ? "text" : "password"}
                  value={loginData.senha}
                  onChange={handleLoginChange}
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20"
                  placeholder="Digite sua senha"
                  required
                  disabled={isLoginLoading || loginSuccess}
                />
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  disabled={isLoginLoading || loginSuccess}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Keyword Field */}
            <div className="space-y-2">
              <Label htmlFor="palavraChave" className="text-sm font-medium text-white">
                Palavra-Chave de Segurança
              </Label>
              <div className="relative">
                <Input
                  id="palavraChave"
                  name="palavraChave"
                  type={showKeyword ? "text" : "password"}
                  value={loginData.palavraChave}
                  onChange={handleLoginChange}
                  className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-blue-400/20"
                  placeholder="Digite a palavra-chave"
                  required
                  disabled={isLoginLoading || loginSuccess}
                />
                <Key className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                <button
                  type="button"
                  onClick={() => setShowKeyword(!showKeyword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  disabled={isLoginLoading || loginSuccess}
                >
                  {showKeyword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
              disabled={isLoginLoading || loginSuccess}
            >
              {isLoginLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando credenciais...
                </div>
              ) : loginSuccess ? (
                "Acesso autorizado!"
              ) : (
                "Acessar Sistema"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-white/60">
              Acesso restrito a administradores autorizados
            </p>
            <p className="text-xs text-white/40 mt-1">
              © {new Date().getFullYear()} Sistema Administrativo
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}