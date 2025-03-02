"use client"

import { useState } from "react"
import { getCategories, deleteCategory } from "@/services/categoryService"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import CategoryDialog from "@/components/CategoryDialog"
import type { Category } from "@/types/category"
import { toast } from "sonner"
import Loading from "@/components/Loading"

const columns: ColumnDef<Category>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "nome", header: "Nome" },
]

export default function Categorias() {
    const [filterValue, setFilterValue] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const queryClient = useQueryClient()

    const {
        data: categories = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    })

    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            toast.success("Categoria deletada com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["categories"] })
        },
        onError: () => {
            toast.error("Erro ao deletar a categoria.")
        },
    })

    const handleDelete = (category: Category) => {
        if (confirm(`Tem certeza que deseja deletar a categoria "${category.nome}"?`)) {
            if (category.id !== undefined) {
                deleteMutation.mutate(category.id)
            } else {
                toast.error("ID da categoria não encontrado.")
            }
        }
    }

    const handleEdit = (category: Category) => {
        setSelectedCategory(category)
        setIsDialogOpen(true)
    }

    const filteredCategories: Category[] = (categories ?? []).filter((category: Category) =>
        (category.nome ?? "").toLowerCase().includes((filterValue ?? "").toLowerCase()),
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
            <h1 className="text-2xl font-bold mb-4">Lista de Categorias</h1>
            <div className="flex items-center justify-end">
                <CategoryDialog
                    category={selectedCategory}
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) setSelectedCategory(undefined)
                    }}
                />
            </div>
            {isLoading ? (
                <Loading />
            ) : error ? (
                <p>Erro ao carregar as categorias.</p>
            ) : (
                <DataTable
                    data={filteredCategories}
                    columns={columns}
                    filterInput={filterInput}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}
