"use client";

import { useEffect } from "react";
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

interface MenuDialogProps {
    menu?: { id?: number; produtoId: string; turno: string };
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export default function MenuDialog({ menu, open, onOpenChange }: MenuDialogProps) {
    const queryClient = useQueryClient();
    const { handleSubmit, setValue, watch, reset } = useForm<{ produtoId: string; turno: string }>({
        defaultValues: { produtoId: "", turno: "" },
    });

    const { data: products } = useQuery({ queryKey: ["products"], queryFn: getProducts });

    useEffect(() => {
        if (menu) {
            console.log("Dados recebidos no modal:", menu);
            console.log("Produto ID recebido:", menu.produtoId);
            setValue("produtoId", menu.produtoId ?? "", { shouldValidate: true });
            setValue("turno", menu.turno ?? "", { shouldValidate: true });
        } else {
            reset();
        }
    }, [menu, setValue, reset]);



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
        mutationFn: (data: { produtoId: string; turno: string }) => {
            if (!menu?.id) throw new Error("Menu não encontrado ou ID inválido");
            return updateMenuItem(Number(menu.id), { id: Number(menu.id), ...data });
        },
        onSuccess: () => {
            toast.success("Menu atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: ["menu"] });
            onOpenChange?.(false);
            reset();
        },
        onError: () => toast.error("Erro ao atualizar o menu"),
    });

    const onSubmit = (data: { produtoId: string; turno: string }) => {
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
                                <Select
                                    onValueChange={(value) => {
                                        console.log("Produto selecionado:", value);
                                        setValue("produtoId", value, { shouldValidate: true });
                                    }}
                                    value={watch("produtoId")}
                                >

                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um produto" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {products?.map(({ id, nome }) => (
                                            id && (
                                                <SelectItem key={id} value={id.toString()}>
                                                    {nome}
                                                </SelectItem>
                                            )
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Turno</Label>
                                <Select
                                    onValueChange={(value) => setValue("turno", value, { shouldValidate: true })}
                                    value={watch("turno")}
                                >
                                    <SelectTrigger>
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
