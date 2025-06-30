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
import {
  Clock,
  User,
  Calendar,
  CreditCard,
  Landmark,
  ChevronsRight,
  FileText,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

export default function TransactionDetailDialog({ open, setOpen, transaction }) {
  if (!transaction) return null;

  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
    };
    return statusColors[status] || statusColors.PENDING;
  };

  const isWithdrawal = transaction.type === "WITHDRAWAL";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium text-muted-foreground">
              ID: #{(transaction.id || "")}
            </div>
            <Badge className={`${getStatusColor(transaction.status)}`}>
              {transaction.status}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">{transaction.user?.name || "Pengguna"}</div>
                <div className="text-sm text-muted-foreground">{transaction.user?.email || "-"}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Tanggal Transaksi</div>
                <div className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {isWithdrawal ? (
                <ArrowUpCircle className="h-4 w-4 mt-0.5 text-red-500" />
              ) : (
                <ArrowDownCircle className="h-4 w-4 mt-0.5 text-green-500" />
              )}
              <div>
                <div className="font-medium">Tipe Transaksi</div>
                <div className="text-sm text-muted-foreground">
                  {isWithdrawal ? "Penarikan (Withdrawal)" : "Deposit"}
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <CreditCard className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Jumlah</div>
                <div className={`text-sm font-medium ${
                  isWithdrawal ? "text-red-600" : "text-green-600"
                }`}>
                  {isWithdrawal ? "-" : "+"}{transaction.amount?.toLocaleString() || 0} poin
                </div>
              </div>
            </div>

            {isWithdrawal && (
              <>
                <div className="flex items-start gap-3">
                  <Landmark className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Detail Bank</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.bankName || "-"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ChevronsRight className="h-4 w-4 mt-0.5 text-muted-foreground" />
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