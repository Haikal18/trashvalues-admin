import api from "../lib/api";

export const getDropoffs = async (page = 1, limit = 10, status = "", search = "") => {
  try {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("limit", limit);
    if (status) params.append("status", status);
    if (search) params.append("search", search);
    
    const response = await api.get(`/dropoffs?${params.toString()}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDropoffById = async (id) => {
  try {
    const response = await api.get(`/dropoffs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createDropoff = async (data) => {
  try {
    const response = await api.post("/dropoffs", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDropoffStatus = async (id, status) => {
  try {
    const response = await api.patch(`/dropoffs/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelDropoff = async (id) => {
  try {
    const response = await api.patch(`/dropoffs/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteDropoff = async (id) => {
  try {
    const response = await api.delete(`/dropoffs/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};