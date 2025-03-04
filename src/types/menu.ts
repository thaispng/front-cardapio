export interface Menu {
  id?: string;
  turno: string;
  produtoIds: string[];
  produtos?: {
    id: string;
    produtoId: string;
    produtos?: {
      nome: string;
      descricao: string;
      preco: number;
      produtoId: string;
    };
  }[];
}
