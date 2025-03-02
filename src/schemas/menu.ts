import { z } from "zod";

export const MenuItemSchema = z.object({
  turno: z.enum(["DIURNO", "NOTURNO"]),
  produtoIds: z.array(z.string()).nonempty(),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;
