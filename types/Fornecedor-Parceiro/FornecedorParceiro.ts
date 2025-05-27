// Interface para o endereço
export interface Address {
    id: string;
    state: string;
    city: string;
    district: string;
    street: string;
    complement: string | null;
    number: string;
    zipCode: string;
  }
  
  // Interface para a loja
  export interface Store {
    id: string;
    name: string;
    description: string | null;
    website: string | null;
    rating: number;
    openingHours: string | null;
    addressId: string;
    partnerId: string;
    address: Address;
  }
  
  // Interface principal para o fornecedor parceiro
  export interface PartnerSupplier {
    id: string;
    tradeName: string;
    companyName: string;
    document: string;
    stateRegistration: string;
    contact: string;
    profileImage: string | null;
    addressId: string;
    accessPending: boolean;
    storeId: string | null;
    store: Store;
  }
  
  // Type para array de fornecedores parceiros
  export type PartnerSuppliers = PartnerSupplier[];
  
  // Interface para profissional associado à loja (baseado no código existente)
  export interface Professional {
    id: string;
    nome: string;
    email: string;
    avatar?: string;
    especialidade: string;
    status: "Aprovado" | "Pendente" | "Rejeitado";
  }
  
  // Interface estendida do fornecedor parceiro com informações adicionais para exibição
  export interface PartnerSupplierWithExtras extends PartnerSupplier {
    totalProfissionais?: number;
    status?: "Ativa" | "Inativa" | "Bloqueada";
  }
  
  // Helpers para acessar propriedades comuns
  export interface PartnerSupplierDisplayData {
    id: string;
    name: string; // tradeName
    document: string;
    city: string; // store.address.city
    state: string; // store.address.state
    fullAddress: string; // endereço completo formatado
    contact: string;
    profileImage: string | null;
    accessPending: boolean;
    storeId: string | null;
    storeName: string; // store.name
    storeRating: number; // store.rating
    storeWebsite: string | null; // store.website
  }
  
  // Função utilitária para converter PartnerSupplier em dados de exibição
  export const mapPartnerSupplierToDisplayData = (partner: PartnerSupplier): PartnerSupplierDisplayData => {
    const { store } = partner;
    const address = store.address;
    
    const fullAddress = [
      address.street,
      address.number,
      address.complement,
      address.district,
      address.city,
      address.state,
      address.zipCode
    ].filter(Boolean).join(', ');
  
    return {
      id: partner.id,
      name: partner.tradeName,
      document: partner.document,
      city: address.city,
      state: address.state,
      fullAddress,
      contact: partner.contact,
      profileImage: partner.profileImage,
      accessPending: partner.accessPending,
      storeId: partner.storeId,
      storeName: store.name,
      storeRating: store.rating,
      storeWebsite: store.website
    };
  };
  
  // Função utilitária para verificar se um fornecedor tem loja ativa
  export const hasActiveStore = (partner: PartnerSupplier): boolean => {
    return !!partner.store && !!partner.storeId;
  };
  
  // Função utilitária para obter endereço formatado
  export const getFormattedAddress = (address: Address): string => {
    return [
      address.street,
      address.number,
      address.complement,
      address.district,
      address.city,
      address.state,
      address.zipCode
    ].filter(Boolean).join(', ');
  };