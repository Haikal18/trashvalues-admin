import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  getDropoffs,
  getDropoffById,
  createDropoff,
  updateDropoffStatus,
  cancelDropoff,
  deleteDropoff,
} from "@/services/dropoffService";

export function useDropoffManagement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const status = searchParams.get("status") || "";
  const search = searchParams.get("search") || "";

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["dropoffs", page, limit, status, search],
    queryFn: () => getDropoffs(page, limit, status, search),
  });

  const dropoffs = data?.data || [];
  const metadata = data?.metadata || {};

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (data) => createDropoff(data),
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Dropoff berhasil dibuat",
      });
      queryClient.invalidateQueries({ queryKey: ["dropoffs"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Gagal membuat dropoff",
        variant: "destructive",
      });
    },
  });

  // Update Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => updateDropoffStatus(id, status),
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Status dropoff berhasil diperbarui",
      });
      queryClient.invalidateQueries({ queryKey: ["dropoffs"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Gagal memperbarui status",
        variant: "destructive",
      });
    },
  });

  // Cancel Mutation
  const cancelMutation = useMutation({
    mutationFn: (id) => cancelDropoff(id),
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Dropoff berhasil dibatalkan",
      });
      queryClient.invalidateQueries({ queryKey: ["dropoffs"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Gagal membatalkan dropoff",
        variant: "destructive",
      });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteDropoff(id),
    onSuccess: () => {
      toast({
        title: "Berhasil",
        description: "Dropoff berhasil dihapus",
      });
      queryClient.invalidateQueries({ queryKey: ["dropoffs"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Gagal menghapus dropoff",
        variant: "destructive",
      });
    },
  });

  // Get by ID Mutation
  const getByIdMutation = useMutation({
    mutationFn: (id) => getDropoffById(id),
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Gagal mengambil data dropoff",
        variant: "destructive",
      });
    },
  });

  // Pagination and Filter Functions
  const goToPage = (newPage) => {
    setSearchParams({ 
      page: newPage.toString(), 
      limit: limit.toString(),
      ...(status && { status }),
      ...(search && { search })
    });
  };

  const changeLimit = (newLimit) => {
    setSearchParams({ 
      page: "1", 
      limit: newLimit.toString(),
      ...(status && { status }),
      ...(search && { search })
    });
  };

  const changeStatus = (newStatus) => {
    setSearchParams({ 
      page: "1", 
      limit: limit.toString(),
      ...(newStatus && { status: newStatus }),
      ...(search && { search })
    });
  };

  const changeSearch = (newSearch) => {
    setSearchParams({ 
      page: "1", 
      limit: limit.toString(),
      ...(status && { status }),
      ...(newSearch && { search: newSearch })
    });
  };

  // Action Functions
  const handleCreateDropoff = (data) => {
    createMutation.mutate(data);
  };

  const handleUpdateStatus = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleCancelDropoff = (id) => {
    cancelMutation.mutate(id);
  };

  const handleDeleteDropoff = (id) => {
    deleteMutation.mutate(id);
  };

  const handleGetDropoffById = async (id) => {
    const result = await getByIdMutation.mutateAsync(id);
    return result?.data;
  };

  return {
    // Data
    dropoffs,
    metadata,
    isLoading,
    isError,
    error,
    
    // Pagination
    currentPage: page,
    currentLimit: limit,
    currentStatus: status,
    currentSearch: search,
    
    // Actions
    handleCreateDropoff,
    handleUpdateStatus,
    handleCancelDropoff,
    handleDeleteDropoff,
    handleGetDropoffById,
    refetch,
    
    // Navigation
    goToPage,
    changeLimit,
    changeStatus,
    changeSearch,
    
    // Loading states
    isCreating: createMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isGettingById: getByIdMutation.isPending,
  };
}