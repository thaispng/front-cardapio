import api from "./api";

export const getMenuCurrent = async () => {
    try {
        const response = await api.get("/cardapio-atual/cardapio-atual");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar itens do cardápio:", error);
        throw error;
    }
};


