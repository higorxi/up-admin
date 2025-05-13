// Vamos melhorar o serviço de profissionais para incluir funcionalidades de indicação

import { apiClient } from "@/lib/api-client"

// Tipos
export type Endereco = {
  cep: string
  rua: string
  numero: string
  complemento?: string
  bairro: string
  cidade: string
  estado: string
}

export type Profissional = {
  id: string
  nome: string
  email: string
  telefone?: string
  especialidade: string
  documento?: string
  biografia?: string
  status: "Aprovado" | "Pendente" | "Rejeitado" | "Inativo"
  dataCadastro: string
  endereco?: Endereco
  avatar?: string
  indicado?: boolean
  indicadoPor?: string
  lojaId?: string
  motivoRejeicao?: string
}

// Dados mockados para desenvolvimento
const mockProfissionais: Profissional[] = [
  {
    id: "1",
    nome: "Dr. João Silva",
    email: "joao.silva@exemplo.com",
    telefone: "(11) 98765-4321",
    especialidade: "Médico",
    documento: "123.456.789-00",
    biografia: "Médico com 10 anos de experiência em clínica geral.",
    status: "Aprovado",
    dataCadastro: "10/04/2023",
    endereco: {
      cep: "01234-567",
      rua: "Av. Paulista",
      numero: "1000",
      complemento: "Sala 123",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
    },
    avatar: "/placeholder.svg?height=40&width=40",
    lojaId: "1",
  },
  {
    id: "2",
    nome: "Dra. Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    telefone: "(11) 91234-5678",
    especialidade: "Dentista",
    documento: "987.654.321-00",
    biografia: "Dentista especializada em ortodontia.",
    status: "Aprovado",
    dataCadastro: "15/05/2023",
    endereco: {
      cep: "04567-890",
      rua: "Rua Augusta",
      numero: "500",
      bairro: "Consolação",
      cidade: "São Paulo",
      estado: "SP",
    },
    avatar: "/placeholder.svg?height=40&width=40",
    indicado: true,
    indicadoPor: "Dr. João Silva",
    lojaId: "2",
  },
  {
    id: "3",
    nome: "Dr. Carlos Santos",
    email: "carlos.santos@exemplo.com",
    telefone: "(21) 98765-1234",
    especialidade: "Fisioterapeuta",
    documento: "456.789.123-00",
    biografia: "Fisioterapeuta especializado em reabilitação esportiva.",
    status: "Pendente",
    dataCadastro: "20/06/2023",
    endereco: {
      cep: "22000-000",
      rua: "Av. Atlântica",
      numero: "2000",
      complemento: "Bloco B, Apto 301",
      bairro: "Copacabana",
      cidade: "Rio de Janeiro",
      estado: "RJ",
    },
    avatar: "/placeholder.svg?height=40&width=40",
    indicado: true,
    indicadoPor: "Dra. Ana Costa",
  },
  {
    id: "4",
    nome: "Dra. Ana Costa",
    email: "ana.costa@exemplo.com",
    telefone: "(31) 97654-3210",
    especialidade: "Nutricionista",
    documento: "789.123.456-00",
    biografia: "Nutricionista com foco em alimentação saudável e emagrecimento.",
    status: "Pendente",
    dataCadastro: "05/07/2023",
    endereco: {
      cep: "30000-000",
      rua: "Av. do Contorno",
      numero: "1500",
      bairro: "Funcionários",
      cidade: "Belo Horizonte",
      estado: "MG",
    },
    avatar: "/placeholder.svg?height=40&width=40",
    lojaId: "4",
  },
  {
    id: "5",
    nome: "Dr. Pedro Alves",
    email: "pedro.alves@exemplo.com",
    telefone: "(41) 98765-8765",
    especialidade: "Psicólogo",
    documento: "321.654.987-00",
    biografia: "Psicólogo clínico com experiência em terapia cognitivo-comportamental.",
    status: "Rejeitado",
    dataCadastro: "10/08/2023",
    endereco: {
      cep: "80000-000",
      rua: "Rua XV de Novembro",
      numero: "700",
      complemento: "Sala 45",
      bairro: "Centro",
      cidade: "Curitiba",
      estado: "PR",
    },
    avatar: "/placeholder.svg?height=40&width=40",
    motivoRejeicao: "Documentação incompleta. Faltou o registro profissional.",
  },
]

// Serviço para gerenciar profissionais
class ProfissionaisService {
  // Listar todos os profissionais
  async listarProfissionais(): Promise<Profissional[]> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.get<Profissional[]>('/profissionais');

      // Usando dados mockados para desenvolvimento
      return mockProfissionais
    } catch (error) {
      console.error("Erro ao listar profissionais:", error)
      throw error
    }
  }

  // Listar profissionais pendentes de aprovação
  async listarProfissionaisPendentes(): Promise<Profissional[]> {
    try {
      console.log('oi')
      // Quando a API estiver pronta, descomente o código abaixo
      const response = await apiClient.get<Profissional[]>('/partner-supplier/pending');

      // Usando dados mockados para desenvolvimento
      console.log('response', response);
      return response
    } catch (error) {
      console.error("Erro ao listar profissionais pendentes:", error)
      throw error
    }
  }

  // Listar profissionais indicados
  async listarProfissionaisIndicados(): Promise<Profissional[]> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.get<Profissional[]>('/profissionais/indicados');

      // Usando dados mockados para desenvolvimento
      return mockProfissionais.filter((p) => p.indicado === true)
    } catch (error) {
      console.error("Erro ao listar profissionais indicados:", error)
      throw error
    }
  }

  // Obter profissional por ID
  async obterProfissionalPorId(id: string): Promise<Profissional | null> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.get<Profissional>(`/profissionais/${id}`);

      // Usando dados mockados para desenvolvimento
      const profissional = mockProfissionais.find((p) => p.id === id)
      return profissional || null
    } catch (error) {
      console.error(`Erro ao obter profissional com ID ${id}:`, error)
      throw error
    }
  }

  // Cadastrar novo profissional
  async cadastrarProfissional(dados: Omit<Profissional, "id" | "status" | "dataCadastro">): Promise<Profissional> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.post<Profissional>('/profissionais', dados);

      // Simulando cadastro para desenvolvimento
      console.log("Profissional cadastrado:", dados)

      // Simulando resposta da API
      return {
        id: Math.random().toString(36).substring(2, 9),
        ...dados,
        status: "Pendente",
        dataCadastro: new Date().toLocaleDateString(),
      }
    } catch (error) {
      console.error("Erro ao cadastrar profissional:", error)
      throw error
    }
  }

  // Atualizar profissional existente
  async atualizarProfissional(id: string, dados: Partial<Profissional>): Promise<Profissional> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.put<Profissional>(`/profissionais/${id}`, dados);

      // Simulando atualização para desenvolvimento
      console.log(`Profissional ${id} atualizado:`, dados)

      // Simulando resposta da API
      const profissional = mockProfissionais.find((p) => p.id === id)
      if (!profissional) {
        throw new Error(`Profissional com ID ${id} não encontrado`)
      }

      return {
        ...profissional,
        ...dados,
      }
    } catch (error) {
      console.error(`Erro ao atualizar profissional com ID ${id}:`, error)
      throw error
    }
  }

  // Aprovar profissional
  async aprovarProfissional(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.patch(`/profissionais/${id}/aprovar`, {});

      // Simulando aprovação para desenvolvimento
      console.log(`Profissional ${id} aprovado`)

      // Atualizar o status no mock para desenvolvimento
      const index = mockProfissionais.findIndex((p) => p.id === id)
      if (index !== -1) {
        mockProfissionais[index].status = "Aprovado"
      }
    } catch (error) {
      console.error(`Erro ao aprovar profissional com ID ${id}:`, error)
      throw error
    }
  }

  // Rejeitar profissional
  async rejeitarProfissional(id: string, motivo?: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.patch(`/profissionais/${id}/rejeitar`, { motivo });

      // Simulando rejeição para desenvolvimento
      console.log(`Profissional ${id} rejeitado. Motivo: ${motivo}`)

      // Atualizar o status no mock para desenvolvimento
      const index = mockProfissionais.findIndex((p) => p.id === id)
      if (index !== -1) {
        mockProfissionais[index].status = "Rejeitado"
        mockProfissionais[index].motivoRejeicao = motivo
      }
    } catch (error) {
      console.error(`Erro ao rejeitar profissional com ID ${id}:`, error)
      throw error
    }
  }

  // Excluir profissional
  async excluirProfissional(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.delete(`/profissionais/${id}`);

      // Simulando exclusão para desenvolvimento
      console.log(`Profissional ${id} excluído`)

      // Remover do mock para desenvolvimento
      const index = mockProfissionais.findIndex((p) => p.id === id)
      if (index !== -1) {
        mockProfissionais.splice(index, 1)
      }
    } catch (error) {
      console.error(`Erro ao excluir profissional com ID ${id}:`, error)
      throw error
    }
  }

  // Listar profissionais por loja
  async listarProfissionaisPorLoja(lojaId: string): Promise<Profissional[]> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.get<Profissional[]>(`/lojas/${lojaId}/profissionais`);

      // Usando dados mockados para desenvolvimento
      return mockProfissionais.filter((p) => p.lojaId === lojaId)
    } catch (error) {
      console.error(`Erro ao listar profissionais da loja ${lojaId}:`, error)
      throw error
    }
  }

  // Desativar profissional
  async desativarProfissional(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.patch(`/profissionais/${id}/desativar`, {});

      // Simulando desativação para desenvolvimento
      console.log(`Profissional ${id} desativado`)

      // Atualizar o status no mock para desenvolvimento
      const index = mockProfissionais.findIndex((p) => p.id === id)
      if (index !== -1) {
        mockProfissionais[index].status = "Inativo"
      }
    } catch (error) {
      console.error(`Erro ao desativar profissional com ID ${id}:`, error)
      throw error
    }
  }

  // Ativar profissional
  async ativarProfissional(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.patch(`/profissionais/${id}/ativar`, {});

      // Simulando ativação para desenvolvimento
      console.log(`Profissional ${id} ativado`)

      // Atualizar o status no mock para desenvolvimento
      const index = mockProfissionais.findIndex((p) => p.id === id)
      if (index !== -1) {
        mockProfissionais[index].status = "Aprovado"
      }
    } catch (error) {
      console.error(`Erro ao ativar profissional com ID ${id}:`, error)
      throw error
    }
  }
}

export const profissionaisService = new ProfissionaisService()
