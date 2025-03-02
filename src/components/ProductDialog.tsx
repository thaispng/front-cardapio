"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"
import { getCategories } from "@/services/categoryService"
import { createProduct, updateProduct } from "@/services/productService"
import { productSchema, type ProductFormData } from "@/schemas/productSchema"
import { toast } from "sonner"
import type { Product } from "@/types/product"
import { ImageUpload } from "./image-upload"

interface Category {
    id: string
    nome: string
}

interface ProductDialogProps {
    product?: Product
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export default function ProductDialog({ product, open, onOpenChange }: ProductDialogProps) {
    const queryClient = useQueryClient()
    const [imageUrl, setImageUrl] = useState("")

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
    })


    useEffect(() => {
        if (product) {
            reset({
                nome: product.nome,
                preco: product.preco,
                descricao: product.descricao,
                imagem: product.imagem || "",
                categoriaId: product.categoriaId || undefined,
            })
            setImageUrl(product.imagem || "")
        } else {
            reset({
                nome: "",
                preco: 0,
                descricao: "",
                imagem: "",
                categoriaId: undefined,
            })
            setImageUrl("")
        }
    }, [product, reset])

    const {
        data: categories,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    const createMutation = useMutation({
        mutationFn: (data: ProductFormData) => createProduct({ ...data, categoriaId: data.categoriaId || "" }),
        onSuccess: () => {
            toast.success("Produto cadastrado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["products"] })
            onOpenChange?.(false)
            reset()
        },
        onError: () => {
            toast.error("Erro ao cadastrar o produto")
        },
    })

    const updateMutation = useMutation({
        mutationFn: (data: ProductFormData) => {
            data.categoriaId = data.categoriaId || "";
            if (!product?.id) throw new Error("ID do produto não encontrado")
            return updateProduct(product.id, data)
        },
        onSuccess: () => {
            toast.success("Produto atualizado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["products"] })
            onOpenChange?.(false)
            reset()
        },
        onError: () => {
            toast.error("Erro ao atualizar o produto")
        },
    })

    const onSubmit = (data: ProductFormData) => {
        if (product?.id) {
            updateMutation.mutate(data)
        } else {
            createMutation.mutate(data)
        }
    }

    const handleImageChange = (url: string) => {
        setValue("imagem", url)
        setImageUrl(url)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{!product && <Button variant="default">Cadastrar produto</Button>}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{product ? "Editar produto" : "Cadastrar produto"}</DialogTitle>
                    <DialogDescription asChild>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <div>
                                <Label>Nome</Label>
                                <Input placeholder="Nome" {...register("nome")} />
                                {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
                            </div>
                            <div>
                                <Label>Preço</Label>
                                <Input type="number" step="0.01" placeholder="Preço" {...register("preco", { valueAsNumber: true })} />
                                {errors.preco && <p className="text-red-500 text-sm">{errors.preco.message}</p>}
                            </div>
                            <div>
                                <Label>Descrição</Label>
                                <Input placeholder="Descrição" {...register("descricao")} />
                                {errors.descricao && <p className="text-red-500 text-sm">{errors.descricao.message}</p>}
                            </div>
                            <div>
                                <Label>Imagem</Label>
                                <ImageUpload value={imageUrl} onChange={handleImageChange} />
                                {errors.imagem && <p className="text-red-500 text-sm">{errors.imagem.message}</p>}
                            </div>
                            <div className="w-full">
                                <Label>Categoria (opcional)</Label>
                                {isPending ? (
                                    <p>Carregando categorias...</p>
                                ) : isError ? (
                                    <p>Erro ao carregar categorias</p>
                                ) : (
                                    <Combobox
                                        items={
                                            categories?.map((cat: Category) => ({
                                                value: cat.id,
                                                label: cat.nome,
                                            })) || []
                                        }
                                        placeholder="Selecione uma categoria"
                                        defaultValue={product?.categoriaId}
                                        onSelect={(value) => setValue("categoriaId", value)}
                                    />
                                )}
                                {errors.categoriaId && <p className="text-red-500 text-sm">{errors.categoriaId.message}</p>}
                            </div>
                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                                {createMutation.isPending || updateMutation.isPending
                                    ? product
                                        ? "Atualizando..."
                                        : "Cadastrando..."
                                    : product
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

