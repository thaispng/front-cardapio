export interface Menu {
  id?: string;
  turno: string;
  produtoIds: string[];
  produtos?: {
    id: string;
    produto?: { nome: string; descricao: string; preco: number };
  }[];
}
