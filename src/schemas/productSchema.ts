import { z } from "zod";

export const productSchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
  preco: z.number().min(0, "O preço deve ser maior ou igual a zero"),
  descricao: z.string().min(1, "A descrição é obrigatória"),
  imagem: z
    .union([z.string().url("A imagem deve ser uma URL válida"), z.literal("")])
    .optional(),
  categoriaId: z.string().min(1, "A categoria é obrigatória").optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
