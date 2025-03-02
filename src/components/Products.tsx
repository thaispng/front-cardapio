"use client"

import { useState } from "react"
import { getProducts, deleteProduct } from "@/services/productService"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import ProductDialog from "@/components/ProductDialog"
import type { Product } from "@/types/product"
import { toast } from "sonner"
import Loading from "@/components/Loading"

const columns: ColumnDef<Product>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nome", header: "Nome" },
    { accessorKey: "preco", header: "Preço", cell: ({ row }) => `R$ ${row.original.preco.toFixed(2)}` },
    {
        accessorKey: "imagem",
        header: "Imagem",
        cell: ({ row }) => (
            <Image
                src={row.original.imagem || "/placeholder.svg"}
                alt={row.original.nome}
                width={40}
                height={40}
                className="object-cover"
            />
        ),
    },
    { accessorKey: "descricao", header: "Descrição" },
    {
        accessorKey: "categoriaId",
        header: "Categoria",
        cell: ({ row }) => row.original.categoriaId,
    },
    {
        accessorKey: "criadoEm",
        header: "Criado",
        cell: ({ row }) => new Date(row.original.criadoEm ?? "").toLocaleDateString("pt-BR"),
    },
    {
        accessorKey: "atualizadoEm",
        header: "Atualizado",
        cell: ({ row }) => new Date(row.original.atualizadoEm ?? "").toLocaleDateString("pt-BR"),
    },
]

export default function Produtos() {
    const [filterValue, setFilterValue] = useState<string>("")
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const queryClient = useQueryClient()

    const {
        data: products = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["products"],
        queryFn: getProducts,
    })

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            toast.success("Produto deletado com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
        onError: () => {
            toast.error("Erro ao deletar o produto.")
        },
    })

    const handleDelete = (product: Product) => {
        if (confirm(`Tem certeza que deseja deletar o produto "${product.nome}"?`)) {
            if (product.id !== undefined) {
                deleteMutation.mutate(product.id)
            } else {
                toast.error("ID do produto não encontrado.")
            }
        }
    }

    const handleEdit = (product: Product) => {
        setSelectedProduct(product)
        setIsDialogOpen(true)
    }

    const filteredProducts: Product[] = (products ?? []).filter((product: Product) =>
        (product.nome ?? "").toLowerCase().includes((filterValue ?? "").toLowerCase()),
    )

    const filterInput = (
        <Input
            placeholder="Filtrar por nome..."
            value={filterValue}
            onChange={(event) => setFilterValue(event.target.value)}
            className="max-w-sm"
        />
    )

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Lista de Produtos</h1>
            <div className="flex items-center justify-end">
                <ProductDialog
                    product={selectedProduct}
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) setSelectedProduct(undefined)
                    }}
                />
            </div>
            {isLoading ? (
                <Loading />
            ) : error ? (
                <p>Erro ao carregar os produtos.</p>
            ) : (
                <DataTable
                    data={filteredProducts}
                    columns={columns}
                    filterInput={filterInput}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}
