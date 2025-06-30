import api from "../lib/api";

export const getWasteTypes = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/waste-types?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createWasteType = async (data) => {
  try {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.pricePerKg) formData.append("pricePerKg", data.pricePerKg);
    if (data.description) formData.append("description", data.description);
    if (data.isActive !== undefined) formData.append("isActive", data.isActive);
    if (data.image && data.image instanceof File)
      formData.append("image", data.image);

    const response = await api.post("/waste-types", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateWasteType = async (id, data) => {
  try {
    const formData = new FormData();

    if (data.name) formData.append("name", data.name);
    if (data.pricePerKg) formData.append("pricePerKg", data.pricePerKg);
    if (data.description) formData.append("description", data.description);
    if (data.isActive !== undefined) formData.append("isActive", data.isActive);
    if (data.image && data.image instanceof File)
      formData.append("image", data.image);

    const response = await api.patch(`/waste-types/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteWasteType = async (id) => {
  try {
    const response = await api.delete(`/waste-types/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
