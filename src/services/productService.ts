import api from "./api";
import { Product } from "@/types/product";


export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/produtos");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};


export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get(`/produtos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produto:", error);
    throw error;
  }
};


export const createProduct = async (productData: Product): Promise<Product> => {
  try {
    const response = await api.post("/produtos", productData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw error;
  }
};


export const updateProduct = async (
  id: number,
  productData: Partial<Product>
): Promise<Product> => {
  try {
    const response = await api.put(`/produtos/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw error;
  }
};


export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/produtos/${id}`);
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    throw error;
  }
};
