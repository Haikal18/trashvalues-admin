import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export function useDropoffs() {
  const queryClient = useQueryClient();
  const [selectedDropoff, setSelectedDropoff] = useState(null);

  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    status: "",
    search: "",
  });

  const buildQueryParams = (params) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", params.page);
    queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);
    if (params.search) queryParams.append("search", params.search);
    return queryParams.toString();
  };

  const fetchDropoffsData = async () => {
    const queryString = buildQueryParams(params);
    const response = await api.get(`/dropoffs?${queryString}`);

    const mappedDropoffs = (response.data?.data || []).map((item) => ({
      id: item.id,
      userId: item.userId,
      user: item.user,
      status: item.status,
      weight: item.totalWeight || 0,
      points: item.totalAmount || 0,
      wasteType:
        Array.isArray(item.wasteItems) && item.wasteItems.length > 0
          ? item.wasteItems.map((w) => w.wasteType?.name || "Unknown").join(", ")
          : "Mixed waste",
      location: item.pickupAddress,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      notes: item.notes,
    }));

    return {
      dropoffs: mappedDropoffs,
      totalRows:
        response.data?.metadata?.totalDropoffs || mappedDropoffs.length || 0,
    };
  };

  const dropoffsQuery = useQuery({
    queryKey: ["dropoffs", params],
    queryFn: fetchDropoffsData,
    onError: (error) => {
      toast({
        title: "Error fetching dropoffs",
        description:
          error?.response?.data?.message || "Failed to load dropoffs",
        variant: "destructive",
      });
    },
  });

  const fetchDropoffById = async (id) => {
    const response = await api.get(`/dropoffs/${id}`);
    const item = response.data?.data;

    if (!item) return null;

    return {
      id: item.id,
      userId: item.userId,
      user: item.user,
      status: item.status,
      weight: item.totalWeight || 0,
      points: item.totalAmount || 0,
      wasteType:
        Array.isArray(item.wasteItems) && item.wasteItems.length > 0
          ? item.wasteItems.map((w) => w.wasteType?.name || "Unknown").join(", ")
          : "Mixed waste",
      location: item.pickupAddress,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      notes: item.notes,
    };
  };

  const dropoffDetailMutation = useMutation({
    mutationFn: fetchDropoffById,
    onSuccess: (data) => {
      setSelectedDropoff(data);
    },
    onError: (error) => {
      toast({
        title: "Error fetching dropoff",
        description:
          error?.response?.data?.message || "Failed to load dropoff details",
        variant: "destructive",
      });
    },
  });

  const fetchDropoffsByUserId = async (userId) => {
    const response = await api.get(`/dropoffs/users/${userId}`);

    return (response.data?.data || []).map((item) => ({
      id: item.id,
      userId: item.userId,
      user: item.user,
      status: item.status,
      weight: item.totalWeight || 0,
      points: item.totalAmount || 0,
      wasteType:
        Array.isArray(item.wasteItems) && item.wasteItems.length > 0
          ? item.wasteItems.map((w) => w.wasteType?.name || "Unknown").join(", ")
          : "Mixed waste",
      location: item.pickupAddress,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      notes: item.notes,
    }));
  };

  const userDropoffsMutation = useMutation({
    mutationFn: fetchDropoffsByUserId,
    onError: (error) => {
      toast({
        title: "Error fetching user dropoffs",
        description:
          error?.response?.data?.message || "Failed to load user dropoffs",
        variant: "destructive",
      });
    },
  });

  const updateDropoffStatusFn = async ({ id, status }) => {
    const response = await api.patch(`/dropoffs/${id}/status`, { status });
    return response.data;
  };

  const updateStatusMutation = useMutation({
    mutationFn: updateDropoffStatusFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropoffs"] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description:
          error?.response?.data?.message || "Failed to update dropoff status",
        variant: "destructive",
      });
    },
  });

  const deleteDropoffFn = async (id) => {
    const response = await api.delete(`/dropoffs/${id}`);
    return response.data;
  };

  const deleteDropoffMutation = useMutation({
    mutationFn: deleteDropoffFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dropoffs"] });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description:
          error?.response?.data?.message || "Failed to delete dropoff",
        variant: "destructive",
      });
    },
  });

  const handlePageChange = (page) => {
    setParams((prev) => ({ ...prev, page }));
  };

  const handlePerRowsChange = (newLimit, page) => {
    setParams((prev) => ({ ...prev, page, limit: newLimit }));
  };

  const handleStatusFilterChange = (status) => {
    setParams((prev) => ({ ...prev, page: 1, status }));
  };

  const handleSearch = (search) => {
    setParams((prev) => ({ ...prev, page: 1, search }));
  };

  const getDropoffById = async (id) => {
    const result = await dropoffDetailMutation.mutateAsync(id);
    return result;
  };

  const getDropoffsByUserId = async (userId) => {
    return await userDropoffsMutation.mutateAsync(userId);
  };

  const updateDropoffStatus = async (id, status) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      toast({ title: `Dropoff status updated to ${status}` });
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteDropoff = async (id) => {
    try {
      await deleteDropoffMutation.mutateAsync(id);
      toast({ title: "Dropoff deleted successfully" });
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    dropoffs: dropoffsQuery.data?.dropoffs || [],
    loading: dropoffsQuery.isLoading,
    totalRows: dropoffsQuery.data?.totalRows || 0,
    selectedDropoff,
    params,
    fetchDropoffs: () =>
      queryClient.invalidateQueries({ queryKey: ["dropoffs"] }),
    getDropoffById,
    getDropoffsByUserId,
    updateDropoffStatus,
    deleteDropoff,
    handlePageChange,
    handlePerRowsChange,
    handleStatusFilterChange,
    handleSearch,
    setSelectedDropoff,
  };
}