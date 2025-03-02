"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProducts } from "@/services/productService";
import { toast } from "sonner";
import { createMenuItem, updateMenuItem } from "@/services/menuService";
import { Menu } from "@/types/menu";
import { Checkbox } from "./ui/checkbox";
import { Product } from "@/types/product";

interface MenuDialogProps {
    menu?: { id?: number; produtos: { produtoId: string }[]; turno: string };
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function MenuDialog({ menu, open, onOpenChange }: MenuDialogProps) {
    const [selectedProducts, setSelectedProducts] = useState<string[]>();
    const queryClient = useQueryClient();
    const { handleSubmit, setValue, watch, reset } = useForm<{ produtoIds: string[]; turno: string }>({
        defaultValues: { produtoIds: [], turno: "" },
    });

    const { data: products } = useQuery({ queryKey: ["products"], queryFn: getProducts });

    useEffect(() => {
        if (menu) {
            console.log("Dados recebidos no modal:", menu);
            setValue("turno", menu.turno ?? "", { shouldValidate: true });
        } else {
            reset();
        }
    }, [menu, setValue, reset]);

    useEffect(() => {
        if (products && menu && !selectedProducts) {
            const selectedProducts = products.filter((product) =>
                menu.produtos.some((p) => p.produtoId === product.id)
            );
            setSelectedProducts(selectedProducts.map((p) => p.id!));
        }
    }, [menu, products, selectedProducts])

    useEffect(() => {
        if (selectedProducts !== watch("produtoIds") && selectedProducts?.length) {
            setValue("produtoIds", selectedProducts, { shouldValidate: true });
        }
    }, [selectedProducts, setValue, watch])


    const createMutation = useMutation({
        mutationFn: (data: Menu) => createMenuItem(data),
        onSuccess: () => {
            toast.success("Menu cadastrado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["menu"] });
            onOpenChange?.(false);
            reset();
        },
        onError: () => toast.error("Erro ao cadastrar o menu"),
    });

    const updateMutation = useMutation({
        mutationFn: (data: { produtoIds: string[]; turno: string }) => {
            if (!menu?.id) {
                console.error("Erro: ID do menu inválido", menu?.id);
                throw new Error("ID inválido para atualização");
            }
            return updateMenuItem(menu.id.toString(), { id: menu.id.toString(), ...data });
        },
        onSuccess: () => {
            toast.success("Menu atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["menu"] });
            onOpenChange?.(false);
            reset();
        },
        onError: () => toast.error("Erro ao atualizar o menu"),
    });
    const onSubmit = (data: { produtoIds: string[]; turno: string }) => {
        if (menu) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {!menu && (
                <DialogTrigger asChild>
                    <Button variant="default">Cadastrar Menu</Button>
                </DialogTrigger>
            )}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{menu ? "Editar Menu" : "Cadastrar Menu"}</DialogTitle>
                    <DialogDescription>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <div>
                                <Label>Produto</Label>
                                <div className="flex flex-col mt-3 gap-2">
                                    {products?.map((product: Product) => (
                                        <div className="flex flex-row gap-2" key={product.id}>
                                            <Checkbox
                                                name="produtoId"
                                                defaultChecked={!!menu?.produtos.find(produto => produto.produtoId === product.id)}
                                                value={product.id}
                                                onCheckedChange={(value) => {
                                                    if (value && !selectedProducts!.includes(product.id!)) {
                                                        setSelectedProducts([...selectedProducts!, product.id!]);
                                                    } else {
                                                        setSelectedProducts(selectedProducts!.filter((p) => p !== product.id));
                                                    }
                                                }
                                                }
                                            />
                                            <label>{product.nome}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Select
                                    onValueChange={(value) => setValue("turno", value, { shouldValidate: true })}
                                    value={watch("turno")}
                                >
                                    <SelectTrigger disabled={!!menu}>
                                        <SelectValue placeholder="Selecione um turno" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DIURNO">Dia</SelectItem>
                                        <SelectItem value="NOTURNO">Noite</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>

                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                {createMutation.isPending || updateMutation.isPending
                                    ? menu
                                        ? "Atualizando..."
                                        : "Cadastrando..."
                                    : menu
                                        ? "Atualizar"
                                        : "Cadastrar"}
                            </Button>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
