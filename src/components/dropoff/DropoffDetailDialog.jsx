import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { Clock, MapPin, User, Calendar, Package, Scale, Coins } from "lucide-react";

export default function DropoffDetailDialog({ open, onClose, dropoff }) {
  if (!dropoff) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
      CANCELLED: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return statusColors[status] || statusColors.PENDING;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-lg">
        <DialogHeader>
          <DialogTitle>Detail Dropoff</DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium text-muted-foreground">
              ID: #{dropoff.id}
            </div>
            <Badge className={`${getStatusColor(dropoff.status)}`}>
              {dropoff.status}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">{dropoff.user?.name || "Unknown User"}</div>
                <div className="text-sm text-muted-foreground">{dropoff.user?.email || "-"}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Tanggal Pickup</div>
                <div className="text-sm text-muted-foreground">{formatDate(dropoff.pickupDate)}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Alamat Pickup</div>
                <div className="text-sm text-muted-foreground">{dropoff.pickupAddress}</div>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Package className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Metode Pickup</div>
                <div className="text-sm text-muted-foreground">{dropoff.pickupMethod || "PICKUP"}</div>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Dibuat</div>
                <div className="text-sm text-muted-foreground">{formatDate(dropoff.createdAt)}</div>
              </div>
            </div>

            {dropoff.notes && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
                <div className="font-medium mb-1">Catatan:</div>
                <div className="text-muted-foreground">{dropoff.notes}</div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}