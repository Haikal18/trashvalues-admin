import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function useDropoffDialogs(updateDropoffStatus, deleteDropoff, getDropoffById) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [detailOpen, setDetailOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDropoff, setSelectedDropoff] = useState(null);

  const openDetailDialog = (id, dropoffData = null) => {
    setSelectedId(id);
    
    if (dropoffData) {
      setSelectedDropoff(dropoffData);
      setDetailOpen(true);
      return;
    }
    
    const cachedData = queryClient.getQueryData(['dropoff', id]);
    if (cachedData) {
      setSelectedDropoff(cachedData);
      setDetailOpen(true);
      return;
    }
    
    setDetailOpen(true); 
    setSelectedDropoff(null); 
    
    getDropoffById(id)
      .then(data => {
        setSelectedDropoff(data);
      })
      .catch(error => {
        setDetailOpen(false); 
        toast({
          title: "Error",
          description: "Gagal mengambil data dropoff",
          variant: "destructive",
        });
      });
  };

  const openStatusDialog = (id, dropoffData = null) => {
    setSelectedId(id);
    
    if (dropoffData) {
      setSelectedDropoff(dropoffData);
      setStatusDialogOpen(true);
      return;
    }
    

    const cachedData = queryClient.getQueryData(['dropoff', id]);
    if (cachedData) {
      setSelectedDropoff(cachedData);
      setStatusDialogOpen(true);
      return;
    }
    

    setStatusDialogOpen(true); 
    setSelectedDropoff(null); 
    
    getDropoffById(id)
      .then(data => {
        setSelectedDropoff(data);
      })
      .catch(error => {
        setStatusDialogOpen(false); 
        toast({
          title: "Error",
          description: "Gagal mengambil data dropoff",
          variant: "destructive",
        });
      });
  };

  const openDeleteDialog = (id) => {
    setSelectedId(id);
    setDeleteDialogOpen(true);
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedId) return;
    

    const oldStatus = selectedDropoff?.status;
    if (selectedDropoff) {
      setSelectedDropoff(prev => ({ ...prev, status }));
    }
    

    queryClient.setQueryData(['dropoff', selectedId], (oldData) => {
      if (oldData) {
        return { ...oldData, status };
      }
      return oldData;
    });


    queryClient.setQueryData(['dropoffs'], (oldData) => {
      if (oldData?.data) {
        return {
          ...oldData,
          data: oldData.data.map(item => 
            (item.id === selectedId || item._id === selectedId) 
              ? { ...item, status } 
              : item
          )
        };
      }
      return oldData;
    });
    
    try {
      const success = await updateDropoffStatus(selectedId, status);
      if (success) {
        setStatusDialogOpen(false);
        toast({
          title: "Status Berhasil Diubah",
          description: `Status dropoff berhasil diubah menjadi ${status}`,
        });
        

        queryClient.invalidateQueries({ queryKey: ['dropoffs'] });
        queryClient.invalidateQueries({ queryKey: ['dropoff', selectedId] });
      } else {

        if (selectedDropoff) {
          setSelectedDropoff(prev => ({ ...prev, status: oldStatus }));
        }
        

        queryClient.setQueryData(['dropoff', selectedId], (oldData) => {
          if (oldData) {
            return { ...oldData, status: oldStatus };
          }
          return oldData;
        });
        
        queryClient.setQueryData(['dropoffs'], (oldData) => {
          if (oldData?.data) {
            return {
              ...oldData,
              data: oldData.data.map(item => 
                (item.id === selectedId || item._id === selectedId) 
                  ? { ...item, status: oldStatus } 
                  : item
              )
            };
          }
          return oldData;
        });
      }
    } catch (error) {

      if (selectedDropoff) {
        setSelectedDropoff(prev => ({ ...prev, status: oldStatus }));
      }
      

      queryClient.invalidateQueries({ queryKey: ['dropoff', selectedId] });
      queryClient.invalidateQueries({ queryKey: ['dropoffs'] });
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
      

      queryClient.removeQueries({ queryKey: ['dropoff', selectedId] });
      queryClient.invalidateQueries({ queryKey: ['dropoffs'] });
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
    selectedDropoff,
    openDetailDialog,
    openStatusDialog,
    openDeleteDialog,
    handleStatusUpdate,
    handleDelete,
  };
}