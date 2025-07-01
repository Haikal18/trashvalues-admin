import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

// API Functions
const fetchTransactions = async (params) => {
  const queryParams = new URLSearchParams();
  
  if (params.page) queryParams.append("page", params.page);
  if (params.limit) queryParams.append("limit", params.limit);
  if (params.status) queryParams.append("status", params.status);
  if (params.search) queryParams.append("search", params.search);
  
  const response = await api.get(`/transactions?${queryParams.toString()}`);
  return response.data;
};

const fetchTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data.data || response.data;
};

const updateTransactionStatus = async ({ id, status }) => {
  const response = await api.patch(`/transactions/${id}/status`, { status });
  return response.data;
};

export function useTransactions() {
  const queryClient = useQueryClient();
  
  // State for pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [currentStatus, setCurrentStatus] = useState("");
  const [currentSearch, setCurrentSearch] = useState("");

  // Main transactions query
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["transactions", { 
      page: currentPage, 
      limit: currentLimit, 
      status: currentStatus,
      search: currentSearch 
    }],
    queryFn: () => fetchTransactions({
      page: currentPage,
      limit: currentLimit,
      status: currentStatus,
      search: currentSearch,
    }),
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true, // Keep previous data while loading new data
  });

  // Mutation for updating transaction status
  const updateStatusMutation = useMutation({
    mutationFn: updateTransactionStatus,
    onSuccess: (data, variables) => {
      // Update the specific transaction in cache
      queryClient.setQueryData(
        ["transactions", { 
          page: currentPage, 
          limit: currentLimit, 
          status: currentStatus,
          search: currentSearch 
        }],
        (oldData) => {
          if (!oldData) return oldData;
          
          const updatedTransactions = oldData.data.map(transaction =>
            transaction.id === variables.id
              ? { ...transaction, status: variables.status }
              : transaction
          );
          
          return {
            ...oldData,
            data: updatedTransactions,
          };
        }
      );

      // Invalidate and refetch related queries
      queryClient.invalidateQueries(["transactions"]);
      queryClient.invalidateQueries(["transaction", variables.id]);
      
      toast.success("Status transaksi berhasil diperbarui");
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memperbarui status transaksi");
    },
  });

  // Prefetch individual transaction data
  const prefetchTransaction = (id) => {
    queryClient.prefetchQuery({
      queryKey: ["transaction", id],
      queryFn: () => fetchTransactionById(id),
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  };

  // Handler functions
  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const changeLimit = (limit) => {
    setCurrentLimit(limit);
    setCurrentPage(1); // Reset to first page when changing limit
  };

  const changeStatus = (status) => {
    setCurrentStatus(status);
    setCurrentPage(1); // Reset to first page when changing filter
  };

  const changeSearch = (search) => {
    setCurrentSearch(search);
    setCurrentPage(1); // Reset to first page when searching
  };

  return {
    // Data
    transactions: data?.data || [],
    metadata: data?.metadata || {},
    
    // Loading states
    isLoading,
    error,
    
    // Current state
    currentPage,
    currentLimit,
    currentStatus,
    currentSearch,
    
    // Actions
    goToPage,
    changeLimit,
    changeStatus,
    changeSearch,
    refetch,
    prefetchTransaction,
    
    // Mutations
    updateTransactionStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isLoading,
  };
}