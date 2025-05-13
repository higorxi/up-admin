// Tipos
import type { Endereco } from "./profissionais-service"

export type Cadastro = {
  id: string
  nome: string
  email: string
  telefone: string
  tipo: string
  status: "Ativo" | "Inativo"
  dataCadastro: string
  endereco?: Endereco
  documentos?: Array<{
    tipo: string
    nome: string
    url: string
  }>
  dadosAdicionais?: Record<string, any>
  observacoes?: string
}

// Dados mockados para desenvolvimento
const mockCadastros: Cadastro[] = [
  {
    id: "1",
    nome: "João da Silva",
    email: "joao.silva@exemplo.com",
    telefone: "(11) 98765-4321",
    tipo: "Cliente",
    status: "Ativo",
    dataCadastro: "15/04/2023",
    endereco: {
      cep: "01234-567",
      rua: "Av. Paulista",
      numero: "1000",
      complemento: "Apto 123",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
    },
    documentos: [
      {
        tipo: "RG",
        nome: "documento_rg.pdf",
        url: "/placeholder.svg",
      },
      {
        tipo: "CPF",
        nome: "documento_cpf.pdf",
        url: "/placeholder.svg",
      },
    ],
    dadosAdicionais: {
      Profissão: "Engenheiro",
      "Data de Nascimento": "10/05/1985",
      "Estado Civil": "Casado",
    },
    observacoes: "Cliente interessado em planos de saúde para família.",
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    telefone: "(11) 91234-5678",
    tipo: "Fornecedor",
    status: "Ativo",
    dataCadastro: "20/05/2023",
    endereco: {
      cep: "04567-890",
      rua: "Rua Augusta",
      numero: "500",
      bairro: "Consolação",
      cidade: "São Paulo",
      estado: "SP",
    },
    documentos: [
      {
        tipo: "CNPJ",
        nome: "documento_cnpj.pdf",
        url: "/placeholder.svg",
      },
      {
        tipo: "Contrato Social",
        nome: "contrato_social.pdf",
        url: "/placeholder.svg",
      },
    ],
    dadosAdicionais: {
      "Ramo de Atividade": "Materiais Médicos",
      Representante: "Carlos Santos",
      "Telefone Representante": "(11) 98765-1234",
    },
  },
  {
    id: "3",
    nome: "Pedro Almeida",
    email: "pedro.almeida@exemplo.com",
    telefone: "(21) 98765-1234",
    tipo: "Parceiro",
    status: "Inativo",
    dataCadastro: "10/06/2023",
    endereco: {
      cep: "22000-000",
      rua: "Av. Atlântica",
      numero: "2000",
      complemento: "Sala 301",
      bairro: "Copacabana",
      cidade: "Rio de Janeiro",
      estado: "RJ",
    },
    observacoes: "Parceiro com contrato suspenso temporariamente.",
  },
  {
    id: "4",
    nome: "Ana Costa",
    email: "ana.costa@exemplo.com",
    telefone: "(31) 97654-3210",
    tipo: "Cliente",
    status: "Ativo",
    dataCadastro: "05/07/2023",
    endereco: {
      cep: "30000-000",
      rua: "Av. do Contorno",
      numero: "1500",
      bairro: "Funcionários",
      cidade: "Belo Horizonte",
      estado: "MG",
    },
    dadosAdicionais: {
      Profissão: "Médica",
      "Data de Nascimento": "15/08/1990",
      "Estado Civil": "Solteira",
    },
  },
  {
    id: "5",
    nome: "Carlos Santos",
    email: "carlos.santos@exemplo.com",
    telefone: "(41) 98765-8765",
    tipo: "Fornecedor",
    status: "Inativo",
    dataCadastro: "15/08/2023",
    endereco: {
      cep: "80000-000",
      rua: "Rua XV de Novembro",
      numero: "700",
      bairro: "Centro",
      cidade: "Curitiba",
      estado: "PR",
    },
    documentos: [
      {
        tipo: "CNPJ",
        nome: "documento_cnpj.pdf",
        url: "/placeholder.svg",
      },
    ],
    observacoes: "Fornecedor com pendências financeiras.",
  },
]

// Serviço para gerenciar cadastros
class CadastrosService {
  // Listar todos os cadastros
  async listarCadastros(): Promise<Cadastro[]> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.get<Cadastro[]>('/cadastros');

      // Usando dados mockados para desenvolvimento
      return mockCadastros
    } catch (error) {
      console.error("Erro ao listar cadastros:", error)
      throw error
    }
  }

  // Obter cadastro por ID
  async obterCadastroPorId(id: string): Promise<Cadastro | null> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.get<Cadastro>(`/cadastros/${id}`);

      // Usando dados mockados para desenvolvimento
      const cadastro = mockCadastros.find((c) => c.id === id)
      return cadastro || null
    } catch (error) {
      console.error(`Erro ao obter cadastro com ID ${id}:`, error)
      throw error
    }
  }

  // Ativar cadastro
  async ativarCadastro(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.patch(`/cadastros/${id}/ativar`, {});

      // Simulando ativação para desenvolvimento
      console.log(`Cadastro ${id} ativado`)

      // Atualizar o status no mock para desenvolvimento
      const index = mockCadastros.findIndex((c) => c.id === id)
      if (index !== -1) {
        mockCadastros[index].status = "Ativo"
      }
    } catch (error) {
      console.error(`Erro ao ativar cadastro com ID ${id}:`, error)
      throw error
    }
  }

  // Desativar cadastro
  async desativarCadastro(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.patch(`/cadastros/${id}/desativar`, {});

      // Simulando desativação para desenvolvimento
      console.log(`Cadastro ${id} desativado`)

      // Atualizar o status no mock para desenvolvimento
      const index = mockCadastros.findIndex((c) => c.id === id)
      if (index !== -1) {
        mockCadastros[index].status = "Inativo"
      }
    } catch (error) {
      console.error(`Erro ao desativar cadastro com ID ${id}:`, error)
      throw error
    }
  }
}

export const cadastrosService = new CadastrosService()
