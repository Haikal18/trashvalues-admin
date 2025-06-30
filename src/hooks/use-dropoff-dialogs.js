import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useDropoffDialogs(updateDropoffStatus, deleteDropoff, getDropoffById) {
  const { toast } = useToast();
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const openDetailDialog = async (id) => {
    setSelectedId(id);
    await getDropoffById(id);
    setDetailOpen(true);
  };

  const openStatusDialog = async (id) => {
    setSelectedId(id);
    await getDropoffById(id);
    setStatusDialogOpen(true);
  };

  const openDeleteDialog = async (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleStatusUpdate = async (status) => {
    const success = await updateDropoffStatus(selectedId, status);
    if (success) {
      setStatusDialogOpen(false);
      toast({
        title: "Status Berhasil Diubah",
        description: `Status dropoff berhasil diubah menjadi ${status}`,
      });
    }
  };

  const handleDelete = async () => {
    const success = await deleteDropoff(selectedId);
    if (success) {
      setDeleteDialogOpen(false);
      toast({
        title: "Dropoff Berhasil Dihapus",
        description: "Data dropoff telah dihapus dari sistem",
      });
    }
  };

  return {
    detailOpen,
    setDetailOpen,
    statusDialogOpen,
    setStatusDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    selectedId,
    openDetailDialog,
    openStatusDialog,
    openDeleteDialog,
    handleStatusUpdate,
    handleDelete,
  };
}