import { z } from "zod";

export const categorySchema = z.object({
  nome: z.string().min(1, "O nome é obrigatório"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
