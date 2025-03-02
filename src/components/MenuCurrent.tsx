"use client"

import { useState, useEffect } from "react"
import { getMenuCurrent } from "@/services/menuCurrentService"
import { Coffee, Sun, Moon, Utensils } from "lucide-react"

type Categoria = {
    id: string
    nome: string
} | null

type Produto = {
    nome: string
    categoria: Categoria
    preco: number
}

type MenuData = {
    id: string
    turno: string
    criadoEm: string
    atualizadoEm: string
    produtos: { produto: Produto }[]
}

export default function MenuCurrent() {
    const [menuData, setMenuData] = useState<MenuData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchMenu() {
            try {
                const data = await getMenuCurrent()
                setMenuData(data)
                setLoading(false)
            } catch (error) {
                console.error("Erro ao carregar o menu atual", error)
                setLoading(false)
            }
        }
        fetchMenu()
    }, [])

    const formatarPreco = (preco: number) => {
        return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    }

    if (loading) {
        return (
            <div className="w-full max-w-md mx-auto p-8 text-center">
                <Coffee className="animate-pulse h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-lg">Carregando cardápio...</p>
            </div>
        )
    }

    if (!menuData) {
        return (
            <div className="w-full max-w-md mx-auto p-8 text-center bg-card rounded-lg shadow-md">
                <p className="text-lg text-muted-foreground">Não foi possível carregar o cardápio.</p>
            </div>
        )
    }

    const produtosPorCategoria: Record<string, { produto: Produto }[]> = {}

    menuData.produtos.forEach((item) => {
        const categoriaNome = item.produto.categoria ? item.produto.categoria.nome : "Sem categoria"
        if (!produtosPorCategoria[categoriaNome]) {
            produtosPorCategoria[categoriaNome] = []
        }
        produtosPorCategoria[categoriaNome].push(item)
    })

    const isDiurno = menuData.turno === "DIURNO"

    return (
        <div className="w-full max-w-md mx-auto bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="relative p-6 bg-primary text-primary-foreground">
                <div className="absolute top-0 right-0 p-4">
                    {isDiurno ? <Sun className="h-8 w-8 opacity-80" /> : <Moon className="h-8 w-8 opacity-80" />}
                </div>
                <h1 className="text-3xl font-serif font-bold mb-2">Cardápio</h1>
                <p className="text-xl font-medium">{isDiurno ? "Menu Diurno" : "Menu Noturno"}</p>
                <div className="mt-4 text-sm opacity-75">
                    Atualizado em: {new Date(menuData.atualizadoEm).toLocaleDateString("pt-BR")}
                </div>
            </div>
            <div className="p-6 bg-card">
                {menuData.produtos.length > 0 ? (
                    Object.entries(produtosPorCategoria).map(([categoria, produtos], index) => (
                        <div key={index} className="mb-8 last:mb-0">
                            <h2 className="text-xl font-semibold pb-2 mb-4 flex items-center gap-2 border-b border-border text-primary">
                                <Utensils className="h-5 w-5" />
                                {categoria}
                            </h2>
                            <div className="space-y-4">
                                {produtos.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex justify-between items-center p-3 rounded-md transition-colors hover:bg-accent"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium capitalize">{item.produto.nome}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-bold text-primary">{formatarPreco(item.produto.preco)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Sem produtos disponíveis no momento</p>
                    </div>
                )}
            </div>
            <div className="p-4 text-center text-sm bg-secondary text-secondary-foreground">
                <p>Bom apetite! Consulte nossos atendentes para informações sobre alérgenos.</p>
            </div>
        </div>
    )
}

