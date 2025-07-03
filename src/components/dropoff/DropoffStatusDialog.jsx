import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Clock, AlertTriangle, Check, X } from "lucide-react";

export default function DropoffStatusDialog({ open, setOpen, dropoff, onStatusUpdate }) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (open && dropoff) {
      setSelectedStatus(dropoff.status || "");
    }
  }, [open, dropoff]);

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  const submitStatusUpdate = async () => {
    if (!selectedStatus || selectedStatus === dropoff?.status) return;
    
    setIsUpdating(true);
    try {
      await onStatusUpdate(selectedStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!dropoff) return null;

  const statusOptions = [
    {
      value: "PENDING",
      label: "Pending",
      description: "Dropoff menunggu diproses",
      icon: <Clock className="h-4 w-4 text-yellow-500" />,
      color: "border-yellow-200 bg-yellow-50",
    },
    {
      value: "PROCESSING",
      label: "Processing",
      description: "Sedang diproses oleh admin",
      icon: <Loader2 className="h-4 w-4 text-blue-500" />,
      color: "border-blue-200 bg-blue-50",
    },
    {
      value: "COMPLETED",
      label: "Completed",
      description: "Dropoff telah selesai diproses",
      icon: <Check className="h-4 w-4 text-green-500" />,
      color: "border-green-200 bg-green-50",
    },
    {
      value: "REJECTED",
      label: "Rejected",
      description: "Dropoff ditolak",
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      color: "border-red-200 bg-red-50",
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
      description: "Dropoff dibatalkan",
      icon: <X className="h-4 w-4 text-gray-500" />,
      color: "border-gray-200 bg-gray-50",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle>Ubah Status Dropoff</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="text-sm text-muted-foreground mb-4">
            Status saat ini: <span className="font-medium">{dropoff.status}</span>
          </div>
          
          <RadioGroup
            value={selectedStatus}
            onValueChange={handleStatusChange}
            className="space-y-3"
          >
            {statusOptions.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-2 rounded-md border p-3 ${
                  selectedStatus === option.value ? option.color : ""
                }`}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label
                  htmlFor={option.value}
                  className="flex flex-1 cursor-pointer items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <div>{option.icon}</div>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button 
            onClick={submitStatusUpdate} 
            disabled={!selectedStatus || isUpdating || selectedStatus === dropoff?.status}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memperbarui...
              </>
            ) : (
              "Simpan Perubahan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}