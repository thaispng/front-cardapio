"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { createCategory, updateCategory } from "@/services/categoryService"
import { categorySchema, type CategoryFormData } from "@/schemas/categorySchema"
import { toast } from "sonner"
import type { Category } from "@/types/category"

interface CategoryDialogProps {
    category?: Category
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function CategoryDialog({ category, open, onOpenChange }: CategoryDialogProps) {
    const queryClient = useQueryClient()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
    })

    useEffect(() => {
        if (category) {
            reset({ nome: category.nome })
        } else {
            reset({ nome: "" })
        }
    }, [category, reset])

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            toast.success("Categoria cadastrada com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            onOpenChange?.(false)
            reset()
        },
        onError: () => {
            toast.error("Erro ao cadastrar a categoria")
        },
    })

    const updateMutation = useMutation({
        mutationFn: (data: CategoryFormData) => {
            if (!category) throw new Error("Categoria não encontrada")
            return updateCategory(category.id!, { nome: data.nome })
        },
        onSuccess: () => {
            toast.success("Categoria atualizada com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            onOpenChange?.(false)
            reset()
        },
        onError: () => {
            toast.error("Erro ao atualizar a categoria")
        },
    })

    const onSubmit = (data: CategoryFormData) => {
        if (category) {
            updateMutation.mutate(data)
        } else {
            createMutation.mutate({ nome: data.nome })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{!category && <Button variant="default">Cadastrar categoria</Button>}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{category ? "Editar categoria" : "Cadastrar categoria"}</DialogTitle>
                    <DialogDescription asChild>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <div>
                                <Label>Nome</Label>
                                <Input placeholder="Nome" {...register("nome")} />
                                {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
                            </div>
                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                {createMutation.isPending || updateMutation.isPending
                                    ? category
                                        ? "Atualizando..."
                                        : "Cadastrando..."
                                    : category
                                        ? "Atualizar"
                                        : "Cadastrar"}
                            </Button>
                        </form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}