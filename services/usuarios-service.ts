// Vamos melhorar o serviço de usuários para incluir mais funcionalidades

// Tipos
export type Usuario = {
  id: string
  nome: string
  email: string
  tipo: "Administrador" | "Operador" | "Visualizador"
  status: "Ativo" | "Inativo" | "Bloqueado"
  dataCadastro: string
  avatar?: string
}

// Dados mockados para desenvolvimento
const mockUsuarios: Usuario[] = [
  {
    id: "1",
    nome: "Admin Sistema",
    email: "admin@exemplo.com",
    tipo: "Administrador",
    status: "Ativo",
    dataCadastro: "01/01/2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    nome: "João Operador",
    email: "joao@exemplo.com",
    tipo: "Operador",
    status: "Ativo",
    dataCadastro: "15/02/2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    nome: "Maria Visualizadora",
    email: "maria@exemplo.com",
    tipo: "Visualizador",
    status: "Ativo",
    dataCadastro: "10/03/2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    nome: "Pedro Operador",
    email: "pedro@exemplo.com",
    tipo: "Operador",
    status: "Inativo",
    dataCadastro: "05/04/2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    nome: "Ana Visualizadora",
    email: "ana@exemplo.com",
    tipo: "Visualizador",
    status: "Bloqueado",
    dataCadastro: "20/05/2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Serviço para gerenciar usuários
class UsuariosService {
  // Listar todos os usuários
  async listarUsuarios(): Promise<Usuario[]> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.get<Usuario[]>('/usuarios');

      // Usando dados mockados para desenvolvimento
      return mockUsuarios
    } catch (error) {
      console.error("Erro ao listar usuários:", error)
      throw error
    }
  }

  // Obter usuário por ID
  async obterUsuarioPorId(id: string): Promise<Usuario | null> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.get<Usuario>(`/usuarios/${id}`);

      // Usando dados mockados para desenvolvimento
      const usuario = mockUsuarios.find((u) => u.id === id)
      return usuario || null
    } catch (error) {
      console.error(`Erro ao obter usuário com ID ${id}:`, error)
      throw error
    }
  }

  // Cadastrar novo usuário
  async cadastrarUsuario(dados: Omit<Usuario, "id" | "status" | "dataCadastro">): Promise<Usuario> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.post<Usuario>('/usuarios', dados);

      // Simulando cadastro para desenvolvimento
      console.log("Usuário cadastrado:", dados)

      // Simulando resposta da API
      const novoUsuario = {
        id: Math.random().toString(36).substring(2, 9),
        ...dados,
        status: "Ativo",
        dataCadastro: new Date().toLocaleDateString(),
      }

      // Adicionar ao mock para desenvolvimento
      mockUsuarios.push(novoUsuario)

      return novoUsuario
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error)
      throw error
    }
  }

  // Atualizar usuário existente
  async atualizarUsuario(id: string, dados: Partial<Usuario>): Promise<Usuario> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.put<Usuario>(`/usuarios/${id}`, dados);

      // Simulando atualização para desenvolvimento
      console.log(`Usuário ${id} atualizado:`, dados)

      // Simulando resposta da API
      const index = mockUsuarios.findIndex((u) => u.id === id)
      if (index === -1) {
        throw new Error(`Usuário com ID ${id} não encontrado`)
      }

      const usuarioAtualizado = {
        ...mockUsuarios[index],
        ...dados,
      }

      // Atualizar no mock para desenvolvimento
      mockUsuarios[index] = usuarioAtualizado

      return usuarioAtualizado
    } catch (error) {
      console.error(`Erro ao atualizar usuário com ID ${id}:`, error)
      throw error
    }
  }

  // Ativar usuário
  async ativarUsuario(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.patch(`/usuarios/${id}/ativar`, {});

      // Simulando ativação para desenvolvimento
      console.log(`Usuário ${id} ativado`)

      // Atualizar o status no mock para desenvolvimento
      const index = mockUsuarios.findIndex((u) => u.id === id)
      if (index !== -1) {
        mockUsuarios[index].status = "Ativo"
      }
    } catch (error) {
      console.error(`Erro ao ativar usuário com ID ${id}:`, error)
      throw error
    }
  }

  // Desativar usuário
  async desativarUsuario(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.patch(`/usuarios/${id}/desativar`, {});

      // Simulando desativação para desenvolvimento
      console.log(`Usuário ${id} desativado`)

      // Atualizar o status no mock para desenvolvimento
      const index = mockUsuarios.findIndex((u) => u.id === id)
      if (index !== -1) {
        mockUsuarios[index].status = "Inativo"
      }
    } catch (error) {
      console.error(`Erro ao desativar usuário com ID ${id}:`, error)
      throw error
    }
  }

  // Bloquear usuário
  async bloquearUsuario(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.patch(`/usuarios/${id}/bloquear`, {});

      // Simulando bloqueio para desenvolvimento
      console.log(`Usuário ${id} bloqueado`)

      // Atualizar o status no mock para desenvolvimento
      const index = mockUsuarios.findIndex((u) => u.id === id)
      if (index !== -1) {
        mockUsuarios[index].status = "Bloqueado"
      }
    } catch (error) {
      console.error(`Erro ao bloquear usuário com ID ${id}:`, error)
      throw error
    }
  }

  // Redefinir senha do usuário
  async redefinirSenha(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.post(`/usuarios/${id}/redefinir-senha`, {});

      // Simulando redefinição de senha para desenvolvimento
      console.log(`Senha do usuário ${id} redefinida`)
    } catch (error) {
      console.error(`Erro ao redefinir senha do usuário com ID ${id}:`, error)
      throw error
    }
  }

  // Excluir usuário
  async excluirUsuario(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.delete(`/usuarios/${id}`);

      // Simulando exclusão para desenvolvimento
      console.log(`Usuário ${id} excluído`)

      // Remover do mock para desenvolvimento
      const index = mockUsuarios.findIndex((u) => u.id === id)
      if (index !== -1) {
        mockUsuarios.splice(index, 1)
      }
    } catch (error) {
      console.error(`Erro ao excluir usuário com ID ${id}:`, error)
      throw error
    }
  }
}

export const usuariosService = new UsuariosService()
