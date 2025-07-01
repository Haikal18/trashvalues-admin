import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

// API Functions
const fetchTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data.data || response.data;
};

const updateTransactionStatus = async ({ id, status }) => {
  const response = await api.patch(`/transactions/${id}/status`, { status });
  return response.data;
};

export function useTransactionDialogs() {
  const queryClient = useQueryClient();
  
  // Dialog states
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Query for selected transaction
  const {
    data: selectedTransaction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["transaction", selectedId],
    queryFn: () => fetchTransactionById(selectedId),
    enabled: !!selectedId, // Only run when selectedId exists
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for updating status
  const updateStatusMutation = useMutation({
    mutationFn: updateTransactionStatus,
    onSuccess: (data, variables) => {
      // Update the selected transaction cache
      queryClient.setQueryData(["transaction", variables.id], (oldData) => {
        if (!oldData) return oldData;
        return { ...oldData, status: variables.status };
      });

      // Invalidate transactions list to refresh
      queryClient.invalidateQueries(["transactions"]);
      
      // Close dialog
      setStatusDialogOpen(false);
      
      toast.success("Status transaksi berhasil diperbarui");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui status transaksi");
    },
  });

  // Handler functions
  const openDetailDialog = (id) => {
    setSelectedId(id);
    setDetailOpen(true); // Open dialog immediately
  };

  const openStatusDialog = (id) => {
    setSelectedId(id);
    setStatusDialogOpen(true); // Open dialog immediately
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedId) return;
    
    updateStatusMutation.mutate({
      id: selectedId,
      status,
    });
  };

  const closeDialogs = () => {
    setDetailOpen(false);
    setStatusDialogOpen(false);
    // Keep selectedId for a moment to allow smooth closing
    setTimeout(() => setSelectedId(null), 300);
  };

  return {
    // Dialog states
    detailOpen,
    setDetailOpen,
    statusDialogOpen,
    setStatusDialogOpen,
    
    // Data
    selectedTransaction,
    isLoading,
    error,
    
    // Actions
    openDetailDialog,
    openStatusDialog,
    handleStatusUpdate,
    closeDialogs,
    
    // Mutation states
    isUpdatingStatus: updateStatusMutation.isLoading,
  };
}