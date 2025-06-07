// Vamos melhorar o serviço de lojas para incluir mais funcionalidades

import { apiClient } from "@/lib/api-client";
import type { Endereco, Profissional } from "./profissionais-service";
import { profissionaisService } from "./profissionais-service";
import { FornecedorParceiro } from "@/components/profissionais/aprovacao-list";

// Tipos
export type Loja = {
  id: string;
  nome: string;
  cnpj: string;
  telefone?: string;
  email?: string;
  status: "Ativa" | "Inativa" | "Suspensa";
  dataCadastro: string;
  endereco: Endereco;
  totalProfissionais: number;
  descricao?: string;
};

// Dados mockados para desenvolvimento
const mockLojas: Loja[] = [
  {
    id: "1",
    nome: "Clínica Central",
    cnpj: "12.345.678/0001-90",
    telefone: "(11) 3456-7890",
    email: "contato@clinicacentral.com.br",
    status: "Ativa",
    dataCadastro: "05/01/2023",
    endereco: {
      cep: "01234-567",
      rua: "Av. Paulista",
      numero: "1000",
      complemento: "Andar 10",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
    },
    totalProfissionais: 12,
    descricao:
      "Clínica especializada em diversas áreas da saúde, com atendimento de qualidade e preços acessíveis.",
  },
  {
    id: "2",
    nome: "Centro Médico Saúde",
    cnpj: "98.765.432/0001-10",
    telefone: "(11) 2345-6789",
    email: "contato@centromedico.com.br",
    status: "Ativa",
    dataCadastro: "10/02/2023",
    endereco: {
      cep: "04567-890",
      rua: "Rua Augusta",
      numero: "500",
      bairro: "Consolação",
      cidade: "São Paulo",
      estado: "SP",
    },
    totalProfissionais: 8,
    descricao:
      "Centro médico com foco em atendimento humanizado e tecnologia de ponta.",
  },
  {
    id: "3",
    nome: "Clínica Bem Estar",
    cnpj: "45.678.901/0001-23",
    telefone: "(21) 3456-7890",
    email: "contato@bemestar.com.br",
    status: "Inativa",
    dataCadastro: "15/03/2023",
    endereco: {
      cep: "22000-000",
      rua: "Av. Atlântica",
      numero: "2000",
      complemento: "Sala 301",
      bairro: "Copacabana",
      cidade: "Rio de Janeiro",
      estado: "RJ",
    },
    totalProfissionais: 5,
    descricao:
      "Clínica especializada em bem-estar físico e mental, com foco em tratamentos naturais.",
  },
  {
    id: "4",
    nome: "Centro de Especialidades",
    cnpj: "78.901.234/0001-56",
    telefone: "(31) 2345-6789",
    email: "contato@especialidades.com.br",
    status: "Ativa",
    dataCadastro: "20/04/2023",
    endereco: {
      cep: "30000-000",
      rua: "Av. do Contorno",
      numero: "1500",
      bairro: "Funcionários",
      cidade: "Belo Horizonte",
      estado: "MG",
    },
    totalProfissionais: 15,
    descricao:
      "Centro de especialidades médicas com profissionais renomados em diversas áreas.",
  },
  {
    id: "5",
    nome: "Clínica Saúde Total",
    cnpj: "34.567.890/0001-12",
    telefone: "(41) 3456-7890",
    email: "contato@saudetotal.com.br",
    status: "Suspensa",
    dataCadastro: "25/05/2023",
    endereco: {
      cep: "80000-000",
      rua: "Rua XV de Novembro",
      numero: "700",
      complemento: "Andar 5",
      bairro: "Centro",
      cidade: "Curitiba",
      estado: "PR",
    },
    totalProfissionais: 0,
    descricao: "Clínica com atendimento completo para toda a família.",
  },
];

// Serviço para gerenciar lojas
class LojasService {
  // Listar todas as lojas
  async listarFornecedoresParceiros(): Promise<any[]> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      const fornecedoresParceiros = await apiClient.get<any[]>('/partner-suppliers');

      // Usando dados mockados para desenvolvimento
      return fornecedoresParceiros;
    } catch (error) {
      console.error("Erro ao listar lojas:", error);
      throw error;
    }
  }

    // Listar todas as lojas
    async listarFornecedoresParceiros1(): Promise<any[]> {
      try {
        // Quando a API estiver pronta, descomente o código abaixo
        const fornecedoresParceiros = await apiClient.get<any[]>('/love-decorations');
  
        // Usando dados mockados para desenvolvimento
        return fornecedoresParceiros;
      } catch (error) {
        console.error("Erro ao listar lojas:", error);
        throw error;
      }
    }

  // Obter loja por ID
  async obterFornecedorParceiroPorId(id: string): Promise<any> {
    try {
      const fornecedorParceiro = await apiClient.get<any[]>(`/partner-suppliers/${id}`);

      // Usando dados mockados para desenvolvimento
      return fornecedorParceiro;
    } catch (error) {
      console.error(`Erro ao obter loja com ID ${id}:`, error);
      throw error;
    }
  }

  // Cadastrar nova loja
  async cadastrarLoja(
    dados: Omit<Loja, "id" | "status" | "dataCadastro" | "totalProfissionais">
  ): Promise<Loja> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.post<Loja>('/lojas', dados);

      // Simulando cadastro para desenvolvimento
      console.log("Loja cadastrada:", dados);

      // Simulando resposta da API
      const novaLoja = {
        id: Math.random().toString(36).substring(2, 9),
        ...dados,
        status: "Ativa",
        dataCadastro: new Date().toLocaleDateString(),
        totalProfissionais: 0,
      };

      // Adicionar ao mock para desenvolvimento
      mockLojas.push(novaLoja);

      return novaLoja;
    } catch (error) {
      console.error("Erro ao cadastrar loja:", error);
      throw error;
    }
  }

  //Listar Loja Parceira Pendente
  async listarLojasParceirasPendentes(): Promise<FornecedorParceiro[]> {
    try {
      const response = await apiClient.get<FornecedorParceiro[]>(
        "/recommended-professionals/pending"
      );
      return response;
    } catch (error) {
      console.error("Erro ao listar profissionais pendentes:", error);
      throw error;
    }
  }

  // Atualizar loja existente
  async atualizarPendenciaFornecedor(
    id: string,
    accessPending: boolean
  ): Promise<FornecedorParceiro> {
    try {
      const data = {
        accessPending,
      };
      const lojaAtualizada = await apiClient.put<FornecedorParceiro>(
        `/partner-suppliers/pending/${id}`,
        data
      );

      return lojaAtualizada;
    } catch (error) {
      console.error(`Erro ao atualizar loja com ID ${id}:`, error);
      throw error;
    }
  }

  // Atualizar loja existente
  async atualizarLoja(id: string, dados: Partial<Loja>): Promise<Loja> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.put<Loja>(`/lojas/${id}`, dados);

      // Simulando atualização para desenvolvimento
      console.log(`Loja ${id} atualizada:`, dados);

      // Simulando resposta da API
      const index = mockLojas.findIndex((l) => l.id === id);
      if (index === -1) {
        throw new Error(`Loja com ID ${id} não encontrada`);
      }

      const lojaAtualizada = {
        ...mockLojas[index],
        ...dados,
      };

      // Atualizar no mock para desenvolvimento
      mockLojas[index] = lojaAtualizada;

      return lojaAtualizada;
    } catch (error) {
      console.error(`Erro ao atualizar loja com ID ${id}:`, error);
      throw error;
    }
  }

  // Ativar loja
  async ativarLoja(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.patch(`/lojas/${id}/ativar`, {});

      // Simulando ativação para desenvolvimento
      console.log(`Loja ${id} ativada`);

      // Atualizar o status no mock para desenvolvimento
      const index = mockLojas.findIndex((l) => l.id === id);
      if (index !== -1) {
        mockLojas[index].status = "Ativa";
      }
    } catch (error) {
      console.error(`Erro ao ativar loja com ID ${id}:`, error);
      throw error;
    }
  }

  // Desativar loja
  async desativarLoja(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.patch(`/lojas/${id}/desativar`, {});

      // Simulando desativação para desenvolvimento
      console.log(`Loja ${id} desativada`);

      // Atualizar o status no mock para desenvolvimento
      const index = mockLojas.findIndex((l) => l.id === id);
      if (index !== -1) {
        mockLojas[index].status = "Inativa";
      }
    } catch (error) {
      console.error(`Erro ao desativar loja com ID ${id}:`, error);
      throw error;
    }
  }

  // Excluir loja
  async excluirLoja(id: string): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.delete(`/lojas/${id}`);

      // Simulando exclusão para desenvolvimento
      console.log(`Loja ${id} excluída`);

      // Remover do mock para desenvolvimento
      const index = mockLojas.findIndex((l) => l.id === id);
      if (index !== -1) {
        mockLojas.splice(index, 1);
      }
    } catch (error) {
      console.error(`Erro ao excluir loja com ID ${id}:`, error);
      throw error;
    }
  }

  // Listar profissionais de uma loja
  async listarProfissionaisDaLoja(lojaId: string): Promise<any[]> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // return await apiClient.get<any[]>(`/lojas/${lojaId}/profissionais`);

      // Simulando listagem para desenvolvimento
      console.log(`Listando profissionais da loja ${lojaId}`);

      // Usando o serviço de profissionais para obter os profissionais da loja
      return await profissionaisService.listarProfissionaisPorLoja(lojaId);
    } catch (error) {
      console.error(
        `Erro ao listar profissionais da loja com ID ${lojaId}:`,
        error
      );
      throw error;
    }
  }

  // Adicionar profissional à loja
  async adicionarProfissionalALoja(
    lojaId: string,
    profissionalId: string
  ): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.post(`/lojas/${lojaId}/profissionais`, { profissionalId });

      // Simulando adição para desenvolvimento
      console.log(
        `Adicionando profissional ${profissionalId} à loja ${lojaId}`
      );

      // Atualizar o profissional no mock para desenvolvimento
      const profissional = await profissionaisService.obterProfissionalPorId(
        profissionalId
      );
      if (profissional) {
        await profissionaisService.atualizarProfissional(profissionalId, {
          lojaId,
        });

        // Atualizar o contador de profissionais da loja
        const index = mockLojas.findIndex((l) => l.id === lojaId);
        if (index !== -1) {
          mockLojas[index].totalProfissionais += 1;
        }
      }
    } catch (error) {
      console.error(
        `Erro ao adicionar profissional ${profissionalId} à loja ${lojaId}:`,
        error
      );
      throw error;
    }
  }

  // Remover profissional da loja
  async removerProfissionalDaLoja(
    lojaId: string,
    profissionalId: string
  ): Promise<void> {
    try {
      // Quando a API estiver pronta, descomente o código abaixo
      // await apiClient.delete(`/lojas/${lojaId}/profissionais/${profissionalId}`);

      // Simulando remoção para desenvolvimento
      console.log(`Removendo profissional ${profissionalId} da loja ${lojaId}`);

      // Atualizar o profissional no mock para desenvolvimento
      const profissional = await profissionaisService.obterProfissionalPorId(
        profissionalId
      );
      if (profissional && profissional.lojaId === lojaId) {
        await profissionaisService.atualizarProfissional(profissionalId, {
          lojaId: undefined,
        });

        // Atualizar o contador de profissionais da loja
        const index = mockLojas.findIndex((l) => l.id === lojaId);
        if (index !== -1 && mockLojas[index].totalProfissionais > 0) {
          mockLojas[index].totalProfissionais -= 1;
        }
      }
    } catch (error) {
      console.error(
        `Erro ao remover profissional ${profissionalId} da loja ${lojaId}:`,
        error
      );
      throw error;
    }
  }
}

export const lojasService = new LojasService();
