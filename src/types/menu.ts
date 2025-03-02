export interface Menu {
  id?: number;
  turno: string;
  produtoId: string;
  produtos?: {
    id: number;
    produto?: { nome: string; descricao: string; preco: number };
  }[];
}
