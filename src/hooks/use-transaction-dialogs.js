import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useTransactionDialogs(updateTransactionStatus, getTransactionById) {
  const { toast } = useToast();
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openDetailDialog = async (id) => {
    setSelectedId(id);
    await getTransactionById(id);
    setDetailOpen(true);
  };

  const openStatusDialog = async (id) => {
    setSelectedId(id);
    await getTransactionById(id);
    setStatusDialogOpen(true);
  };

  const handleStatusUpdate = async (status) => {
    const success = await updateTransactionStatus(selectedId, status);
    if (success) {
      setStatusDialogOpen(false);
      toast({
        title: "Status Berhasil Diubah",
        description: `Status transaksi berhasil diubah menjadi ${status}`,
      });
    }
  };

  return {
    detailOpen,
    setDetailOpen,
    statusDialogOpen,
    setStatusDialogOpen,
    selectedId,
    openDetailDialog,
    openStatusDialog,
    handleStatusUpdate,
  };
}