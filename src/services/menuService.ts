import api from "./api";
import { Menu } from "../types/menu";

export const getMenuItems = async () => {
  try {
    const response = await api.get("/cardapio");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar itens do cardápio:", error);
    throw error;
  }
};

export const getMenuItemById = async (id: number) => {
  try {
    const response = await api.get(`/cardapio/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar item do cardápio:", error);
    throw error;
  }
};

export const createMenuItem = async (menuItemData: Menu) => {
  try {
    const response = await api.post("/cardapio", menuItemData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar item do cardápio:", error);
    throw error;
  }
};

export const updateMenuItem = async (id: number, menuItemData: Menu) => {
  try {
    const response = await api.put(`/cardapio/${id}`, menuItemData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar item do cardápio:", error);
    throw error;
  }
};

export const deleteMenuItem = async (id: number) => {
  try {
    const response = await api.delete(`/cardapio/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar item do cardápio:", error);
    throw error;
  }
};
