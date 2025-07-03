import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWasteBanks,
  createWasteBank,
  updateWasteBank,
  deleteWasteBank,
} from "@/services/wasteBankService";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export function useWasteBanks() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["wasteBanks", page, limit],
    queryFn: () => getWasteBanks(page, limit),
  });

  const createMutation = useMutation({
    mutationFn: (data) => createWasteBank(data),
    onSuccess: () => {
      toast.success("Bank sampah berhasil dibuat");
      queryClient.invalidateQueries({ queryKey: ["wasteBanks"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Gagal membuat bank sampah"
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateWasteBank(id, data),
    onSuccess: () => {
      toast.success("Bank sampah berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["wasteBanks"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Gagal memperbarui bank sampah"
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteWasteBank(id),
    onSuccess: () => {
      toast.success("Bank sampah berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["wasteBanks"] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Gagal menghapus bank sampah"
      );
    },
  });

  const goToPage = (newPage) => {
    setSearchParams({ page: newPage.toString(), limit: limit.toString() });
  };

  const changeLimit = (newLimit) => {
    setSearchParams({ page: "1", limit: newLimit.toString() });
  };

  const createWasteBankItem = (data) => {
    return createMutation.mutate(data);
  };

  const updateWasteBankItem = (id, data) => {
    return updateMutation.mutate({ id, data });
  };

  const deleteWasteBankItem = (id) => {
    return deleteMutation.mutate(id);
  };

  return {
    wasteBanks: data?.data || [],
    metadata: data?.metadata || {},
    isLoading,
    isError,
    error,
    refetch,
    goToPage,
    changeLimit,
    currentPage: page,
    currentLimit: limit,
    createWasteBank: createWasteBankItem,
    updateWasteBank: updateWasteBankItem,
    deleteWasteBank: deleteWasteBankItem,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}