"use client"

import { useState } from "react"
import { getMenuItems, deleteMenuItem } from "@/services/menuService"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import MenuDialog from "@/components/MenuDialog"
import type { Menu } from "@/types/menu"
import { toast } from "sonner"
import Loading from "@/components/Loading"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

const columns: ColumnDef<Menu>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "turno", header: "Turno" },
    {
        accessorKey: "produtos",
        header: "Produtos",
        cell: ({ row }) => {
            const produtos = row.original.produtos || []

            if (produtos.length === 0) {
                return <span className="text-muted-foreground">Nenhum produto</span>
            }

            return (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                            {produtos.length} produto{produtos.length !== 1 ? "s" : ""}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="space-y-2">
                            <h4 className="font-medium">Lista de Produtos</h4>
                            <div className="max-h-60 overflow-y-auto">
                                {produtos.map((item) => (
                                    <div key={item.id} className="border-b py-2 last:border-0">
                                        <div className="font-medium">{item.produtos?.nome}</div>
                                        <div className="text-sm text-muted-foreground flex justify-between">
                                            <span>{item.produtos?.descricao}</span>
                                            <span className="font-medium">{formatCurrency(item.produtos?.preco || 0)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            )
        },
    },
    { accessorKey: "criadoEm", header: "Criado" },
    { accessorKey: "atualizadoEm", header: "Atualizado" },
]

export default function Menu() {
    const [filterValue, setFilterValue] = useState<string>("")
    const [selectedMenu, setSelectedMenu] = useState<Menu | undefined>(undefined)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const queryClient = useQueryClient()
    console.log(selectedMenu)
    const {
        data: menu = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["menu"],
        queryFn: getMenuItems,
    })

    const deleteMutation = useMutation({
        mutationFn: deleteMenuItem,
        onSuccess: () => {
            toast.success("menu deletada com sucesso!")
            queryClient.invalidateQueries({ queryKey: ["menu"] })
        },
        onError: () => {
            toast.error("Erro ao deletar a menu.")
        },
    })

    const handleDelete = (menu: Menu) => {
        if (menu.id !== undefined) {
            deleteMutation.mutate(Number(menu.id))
        } else {
            toast.error("ID do menu não encontrado.")
        }
    }

    const handleEdit = (menu: Menu) => {
        setSelectedMenu(menu)
        setIsDialogOpen(true)
    }

    const filteredMenu: Menu[] = (menu ?? []).filter((menu: Menu) =>
        (menu.turno ?? "").toLowerCase().includes((filterValue ?? "").toLowerCase()),
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
            <h1 className="text-2xl font-bold mb-4">Lista de Cardápios</h1>
            <div className="flex items-center justify-end">
                <MenuDialog
                    menu={selectedMenu}
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) setSelectedMenu(undefined)
                    }}
                />
            </div>
            {isLoading ? (
                <Loading />
            ) : error ? (
                <p>Erro ao carregar as categorias.</p>
            ) : (
                <DataTable
                    data={filteredMenu}
                    columns={columns}
                    filterInput={filterInput}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}

