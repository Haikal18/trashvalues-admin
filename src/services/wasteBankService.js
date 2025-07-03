import api from "../lib/api";

export const getWasteBanks = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/waste-banks?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWasteBankById = async (id) => {
  try {
    const response = await api.get(`/waste-banks/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createWasteBank = async (data) => {
  try {
    const response = await api.post("/waste-banks", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateWasteBank = async (id, data) => {
  try {
    const response = await api.patch(`/waste-banks/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWasteBank = async (id) => {
  try {
    const response = await api.delete(`/waste-banks/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};