import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

export default function DeleteDropoffDialog({
  open,
  onClose,
  dropoff,
  onDelete,
  isDeleting,
}) {
  const handleDelete = () => {
    if (dropoff?.id) {
      onDelete(dropoff.id);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Dropoff?</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus dropoff ini? Tindakan ini tidak dapat dibatalkan.
            {dropoff && (
              <div className="mt-2 text-sm">
                <strong>ID:</strong> #{dropoff.id}<br />
                <strong>User:</strong> {dropoff.user?.name || "Unknown"}<br />
                <strong>Status:</strong> {dropoff.status}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}