import api from "./api";


export const getCategories = async () => {
  try {
    const response = await api.get("/categorias");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
};


export const getCategoryById = async (id: number) => {
  try {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categoria:", error);
    throw error;
  }
};


export const createCategory = async (categoryData: { name: string }) => {
  try {
    const response = await api.post("/categorias", categoryData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    throw error;
  }
};


export const updateCategory = async (
  id: number,
  categoryData: { name: string }
) => {
  try {
    const response = await api.put(`/categorias/${id}`, categoryData);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    throw error;
  }
};


export const deleteCategory = async (id: number) => {
  try {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    throw error;
  }
};
