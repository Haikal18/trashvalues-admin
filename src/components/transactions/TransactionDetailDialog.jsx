import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  User,
  Calendar,
  CreditCard,
  FileText,
  Clock,
  Loader2,
} from "lucide-react";

export default function TransactionDetailDialog({ open, setOpen, transaction, isLoading }) {
  // Show loading state
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!transaction) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      PROCESSING: { color: "bg-blue-100 text-blue-800", label: "Processing" },
      COMPLETED: { color: "bg-green-100 text-green-800", label: "Completed" },
      REJECTED: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800", label: status };

    return (
      <Badge className={`${config.color} text-xs font-medium`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">User</div>
                <div className="text-sm text-muted-foreground">
                  {transaction.user?.name || "Unknown User"}
                </div>
                {transaction.user?.email && (
                  <div className="text-xs text-muted-foreground">
                    {transaction.user.email}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Tipe Transaksi</div>
                <div className="text-sm text-muted-foreground">
                  {transaction.type || "-"}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-4 w-4 mt-0.5 text-muted-foreground">💰</div>
              <div>
                <div className="font-medium">Jumlah</div>
                <div className="text-sm font-semibold text-green-600">
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-4 w-4 mt-0.5 text-muted-foreground">📊</div>
              <div>
                <div className="font-medium">Status</div>
                <div className="mt-1">
                  {getStatusBadge(transaction.status)}
                </div>
              </div>
            </div>

            {transaction.bankName && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Bank</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.bankName}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-4 w-4 mt-0.5 text-muted-foreground">#</div>
                  <div>
                    <div className="font-medium">Nomor Rekening</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.accountNumber || "-"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Nama Pemilik Rekening</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.accountHolderName || "-"}
                    </div>
                  </div>
                </div>
              </>
            )}

            {transaction.description && (
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Deskripsi</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.description}
                  </div>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Status Terakhir</div>
                <div className="text-sm text-muted-foreground">
                  Diperbarui pada {formatDate(transaction.updatedAt || transaction.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}