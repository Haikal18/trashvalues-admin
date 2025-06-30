import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWasteTypes,
  createWasteType,
  updateWasteType,
  deleteWasteType,
} from "@/services/wasteTypeService";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function useWasteTypes() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["wasteTypes", page, limit],
    queryFn: () => getWasteTypes(page, limit),
  });

  const createMutation = useMutation({
    mutationFn: (data) => createWasteType(data),
    onSuccess: () => {
      toast.success("Waste type created successfully");
      queryClient.invalidateQueries({ queryKey: ["wasteTypes"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to create waste type"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateWasteType(id, data),
    onSuccess: () => {
      toast.success("Waste type updated successfully");
      queryClient.invalidateQueries({ queryKey: ["wasteTypes"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update waste type"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteWasteType(id),
    onSuccess: () => {
      toast.success("Waste type deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["wasteTypes"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete waste type"
      );
    },
  });

  const goToPage = (newPage) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const changeLimit = (newLimit) => {
    setSearchParams({ page: "1", limit: newLimit.toString() });
  };

  const createWasteTypeItem = (data) => {
    return createMutation.mutate(data);
  };

  const updateWasteTypeItem = (id, data) => {
    return updateMutation.mutate({ id, data });
  };

  const deleteWasteTypeItem = (id) => {
    return deleteMutation.mutate(id);
  };

  return {
    wasteTypes: data?.data || [],
    metadata: data?.metadata || {},
    isLoading,
    isError,
    error,
    refetch,
    goToPage,
    changeLimit,
    currentPage: page,
    currentLimit: limit,
    createWasteType: createWasteTypeItem,
    updateWasteType: updateWasteTypeItem,
    deleteWasteType: deleteWasteTypeItem,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
