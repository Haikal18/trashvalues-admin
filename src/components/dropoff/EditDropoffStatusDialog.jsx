import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export default function EditDropoffStatusDialog({
  open,
  onClose,
  dropoff,
  onUpdate,
  isUpdating,
}) {
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (open && dropoff) {
      setSelectedStatus(dropoff.status || "");
    }
  }, [open, dropoff]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedStatus && selectedStatus !== dropoff?.status) {
      onUpdate(dropoff.id, selectedStatus);
    }
  };

  const statusOptions = [
    { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "PROCESSING", label: "Processing", color: "bg-blue-100 text-blue-800" },
    { value: "COMPLETED", label: "Completed", color: "bg-green-100 text-green-800" },
    { value: "REJECTED", label: "Rejected", color: "bg-red-100 text-red-800" },
    { value: "CANCELLED", label: "Cancelled", color: "bg-gray-100 text-gray-800" },
  ];

  if (!dropoff) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle>Ubah Status Dropoff</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Dropoff ID</Label>
              <div className="text-sm text-muted-foreground">#{dropoff.id}</div>
            </div>

            <div className="space-y-2">
              <Label>Status Saat Ini</Label>
              <div>
                <Badge className={statusOptions.find(opt => opt.value === dropoff.status)?.color}>
                  {statusOptions.find(opt => opt.value === dropoff.status)?.label || dropoff.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Baru *</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status baru" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {dropoff.user && (
              <div className="space-y-2">
                <Label>User</Label>
                <div className="text-sm text-muted-foreground">
                  {dropoff.user.name} ({dropoff.user.email})
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isUpdating || !selectedStatus || selectedStatus === dropoff.status}
              className="bg-[#4CAF50] hover:bg-[#45A049]"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}