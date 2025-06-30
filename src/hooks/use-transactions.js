import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";

export function useTransactions() {
  const queryClient = useQueryClient();
  const [selectedTransaction, setSelectedTransaction] = useState(null);

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

  const fetchTransactionsData = async () => {
    const queryString = buildQueryParams(params);
    const response = await api.get(`/transactions?${queryString}`);

    const mappedTransactions = (response.data?.data || []).map((item) => ({
      id: item.id || item._id,
      userId: item.userId,
      user: item.user,
      type: item.type,
      amount: item.amount || 0,
      status: item.status,
      bankName: item.bankName,
      accountNumber: item.accountNumber,
      accountHolderName: item.accountHolderName,
      description: item.description,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return {
      transactions: mappedTransactions,
      totalRows:
        response.data?.metadata?.totalTransactions || mappedTransactions.length || 0,
    };
  };

  const transactionsQuery = useQuery({
    queryKey: ["transactions", params],
    queryFn: fetchTransactionsData,
    onError: (error) => {
      toast({
        title: "Error fetching transactions",
        description:
          error?.response?.data?.message || "Failed to load transactions",
        variant: "destructive",
      });
    },
  });

  const fetchTransactionById = async (id) => {
    const response = await api.get(`/transactions/${id}`);
    const item = response.data?.data;

    if (!item) return null;

    return {
      id: item.id || item._id,
      userId: item.userId,
      user: item.user,
      type: item.type,
      amount: item.amount || 0,
      status: item.status,
      bankName: item.bankName,
      accountNumber: item.accountNumber,
      accountHolderName: item.accountHolderName,
      description: item.description,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  };

  const transactionDetailMutation = useMutation({
    mutationFn: fetchTransactionById,
    onSuccess: (data) => {
      setSelectedTransaction(data);
    },
    onError: (error) => {
      toast({
        title: "Error fetching transaction",
        description:
          error?.response?.data?.message || "Failed to load transaction details",
        variant: "destructive",
      });
    },
  });

  const fetchTransactionsByUserId = async (userId) => {
    const response = await api.get(`/transactions/users/${userId}`);

    return (response.data?.data || []).map((item) => ({
      id: item.id || item._id,
      userId: item.userId,
      user: item.user,
      type: item.type,
      amount: item.amount || 0,
      status: item.status,
      bankName: item.bankName,
      accountNumber: item.accountNumber,
      accountHolderName: item.accountHolderName,
      description: item.description,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));
  };

  const userTransactionsMutation = useMutation({
    mutationFn: fetchTransactionsByUserId,
    onError: (error) => {
      toast({
        title: "Error fetching user transactions",
        description:
          error?.response?.data?.message || "Failed to load user transactions",
        variant: "destructive",
      });
    },
  });

  const updateTransactionStatusFn = async ({ id, status }) => {
    const response = await api.patch(`/transactions/${id}/status`, { status });
    return response.data;
  };

  const updateStatusMutation = useMutation({
    mutationFn: updateTransactionStatusFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description:
          error?.response?.data?.message || "Failed to update transaction status",
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

  const getTransactionById = async (id) => {
    const result = await transactionDetailMutation.mutateAsync(id);
    return result;
  };

  const getTransactionsByUserId = async (userId) => {
    return await userTransactionsMutation.mutateAsync(userId);
  };

  const updateTransactionStatus = async (id, status) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status });
      toast({ title: `Transaction status updated to ${status}` });
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    transactions: transactionsQuery.data?.transactions || [],
    loading: transactionsQuery.isLoading,
    totalRows: transactionsQuery.data?.totalRows || 0,
    selectedTransaction,
    params,
    fetchTransactions: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions"] }),
    getTransactionById,
    getTransactionsByUserId,
    updateTransactionStatus,
    handlePageChange,
    handlePerRowsChange,
    handleStatusFilterChange,
    handleSearch,
    setSelectedTransaction,
  };
}