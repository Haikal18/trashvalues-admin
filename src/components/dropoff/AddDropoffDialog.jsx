import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

export default function AddDropoffDialog({
  open,
  onClose,
  onCreate,
  isCreating,
}) {
  const [formData, setFormData] = useState({
    pickupAddress: "",
    pickupDate: "",
    pickupMethod: "PICKUP",
    notes: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      pickupMethod: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    
    // Reset form
    setFormData({
      pickupAddress: "",
      pickupDate: "",
      pickupMethod: "PICKUP",
      notes: "",
    });
  };

  const handleClose = () => {
    setFormData({
      pickupAddress: "",
      pickupDate: "",
      pickupMethod: "PICKUP",
      notes: "",
    });
    onClose();
  };

  // Get tomorrow's date as minimum date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle>Tambah Dropoff Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pickupAddress">Alamat Pickup *</Label>
              <Textarea
                id="pickupAddress"
                name="pickupAddress"
                value={formData.pickupAddress}
                onChange={handleInputChange}
                placeholder="Masukkan alamat lengkap untuk pickup"
                rows={3}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="pickupDate">Tanggal Pickup *</Label>
              <Input
                id="pickupDate"
                name="pickupDate"
                type="date"
                value={formData.pickupDate}
                onChange={handleInputChange}
                min={getTomorrowDate()}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pickupMethod">Metode Pickup</Label>
              <Select
                value={formData.pickupMethod}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih metode pickup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PICKUP">Pickup</SelectItem>
                  <SelectItem value="DROP_OFF">Drop Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Tambahkan catatan jika diperlukan"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-[#4CAF50] hover:bg-[#45A049]"
            >
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}