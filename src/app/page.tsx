"use client"

import Header from "@/components/ui/header"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Produtos from "@/components/Products"
import Categorias from "@/components/Category"
import Menu from "@/components/Menu"
import MenuCurrent from "@/components/MenuCurrent"

export default function Home() {
  return (
    <>
      <Header />
      <div className="p-8">
        <Tabs defaultValue="produtos">
          <TabsList>
            <TabsTrigger value="cardapio">Cardápio -atual</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="categoria">Categoria</TabsTrigger>
            <TabsTrigger value="cardapios">Cardápios - todos</TabsTrigger>
          </TabsList>

          <TabsContent value="cardapio">
            <MenuCurrent />
          </TabsContent>

          <TabsContent value="cardapios">
            <Menu />
          </TabsContent>

          <TabsContent value="produtos">
            <Produtos />
          </TabsContent>

          <TabsContent value="categoria">
            <Categorias />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
