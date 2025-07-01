import { useState, useMemo, lazy, Suspense } from "react";
import DataTable from "react-data-table-component";
import { useTransactions } from "@/hooks/use-transactions";
import { useTransactionDialogs } from "@/hooks/use-transaction-dialogs";
import { getTransactionTableColumns } from "@/components/transactions/transaction-table-config";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  RefreshCw,
  Search,
  AlertCircle,
  ChevronDown,
  FileText,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TransactionDetailDialog from "@/components/transactions/TransactionDetailDialog";
import TransactionStatusDialog from "@/components/transactions/TransactionStatusDialog";

// Lazy loading komponen PDF untuk menghindari error saat halaman pertama kali di-load
const PDFExport = lazy(() => import("@/components/transactions/PDFExport"));

function History() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  
  // Updated to use React Query hooks
  const {
    transactions,
    isLoading: loading,
    metadata,
    currentPage,
    currentLimit,
    currentStatus,
    goToPage,
    changeLimit,
    changeStatus,
    refetch: fetchTransactions,
    prefetchTransaction,
  } = useTransactions();

  // Gunakan useMemo sebagai pengganti useState + useEffect untuk filtering
  const filteredTransactions = useMemo(() => {
    if (!searchTerm.trim()) {
      return transactions;
    }

    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return transactions.filter(transaction => {
      // Search in user name and email
      const userNameMatch = transaction.user?.name?.toLowerCase().includes(lowercasedSearchTerm);
      const userEmailMatch = transaction.user?.email?.toLowerCase().includes(lowercasedSearchTerm);
      
      // Search in transaction type, description/details
      const typeMatch = transaction.type?.toLowerCase().includes(lowercasedSearchTerm);
      const detailsMatch = transaction.details?.toLowerCase().includes(lowercasedSearchTerm);
      const notesMatch = transaction.notes?.toLowerCase().includes(lowercasedSearchTerm);
      
      // Search in amount
      const amountMatch = transaction.amount?.toString().includes(lowercasedSearchTerm);
      
      // Search in date (formatted as string)
      const dateMatch = new Date(transaction.createdAt)
        .toLocaleDateString('id-ID', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
        .toLowerCase()
        .includes(lowercasedSearchTerm);
      
      // Return true if any field matches
      return userNameMatch || userEmailMatch || typeMatch || detailsMatch || 
             notesMatch || amountMatch || dateMatch;
    });
  }, [transactions, searchTerm]);

  // Client-side search handler
  const handleLocalSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Updated pagination handlers to use React Query
  const handlePageChange = (page) => {
    if (!searchTerm) {
      goToPage(page);
    }
  };

  const handlePerRowsChange = (newPerPage) => {
    if (!searchTerm) {
      changeLimit(newPerPage);
    }
  };

  const handleStatusFilterChange = (status) => {
    changeStatus(status);
    setSearchTerm(""); // Clear search when changing filter
  };

  // Prepare data for PDF export
  const prepareTransactionsForPDF = () => {
    return filteredTransactions.map(t => ({
      id: t.id || "",
      user: t.user ? { name: t.user.name || "N/A" } : { name: "N/A" },
      type: t.type || "",
      amount: typeof t.amount === 'number' ? t.amount : 0,
      status: t.status || "",
      createdAt: t.createdAt || new Date().toISOString()
    }));
  };

  // Updated to use React Query dialogs
  const {
    detailOpen,
    setDetailOpen,
    statusDialogOpen,
    setStatusDialogOpen,
    selectedTransaction,
    isLoading: dialogLoading,
    openDetailDialog,
    openStatusDialog,
    handleStatusUpdate,
  } = useTransactionDialogs();

  // Updated columns to include prefetch function
  const columns = getTransactionTableColumns(
    openDetailDialog,
    openStatusDialog,
    isMobile,
    isTablet,
    prefetchTransaction // Pass preload function
  );

  // Create params object for compatibility with existing filter buttons
  const params = {
    status: currentStatus,
    limit: currentLimit,
  };

  // Calculate total rows for pagination
  const totalRows = searchTerm ? filteredTransactions.length : metadata?.total || 0;

  return (
    <div className="p-4 md:p-6">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">History Transaksi</h1>
          <div className="flex gap-2">
            <Button
              onClick={fetchTransactions}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {!isMobile && "Refresh"}
            </Button>
            
            {filteredTransactions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsPDFModalOpen(true)}
              >
                <FileText className="h-4 w-4" />
                {!isMobile && "Export PDF"}
              </Button>
            )}
          </div>
        </div>

        <Card className="shadow-sm">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Cari transaksi..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={handleLocalSearch}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={params.status === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("")}
                  className={`text-xs h-9 flex-1 sm:flex-none ${
                    params.status === "" 
                      ? "bg-[#4CAF50] hover:bg-[#45a049] text-white border-[#4CAF50]" 
                      : "border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
                  }`}
                >
                  Semua
                </Button>
                <Button
                  variant={params.status === "PENDING" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("PENDING")}
                  className={`text-xs h-9 flex-1 sm:flex-none ${
                    params.status === "PENDING" 
                      ? "bg-[#4CAF50] hover:bg-[#45a049] text-white border-[#4CAF50]" 
                      : "border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
                  }`}
                >
                  Pending
                </Button>
                <Button
                  variant={params.status === "PROCESSING" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("PROCESSING")}
                  className={`text-xs h-9 flex-1 sm:flex-none ${
                    params.status === "PROCESSING" 
                      ? "bg-[#4CAF50] hover:bg-[#45a049] text-white border-[#4CAF50]" 
                      : "border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
                  }`}
                >
                  Processing
                </Button>
                <Button
                  variant={params.status === "COMPLETED" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("COMPLETED")}
                  className={`text-xs h-9 flex-1 sm:flex-none ${
                    params.status === "COMPLETED" 
                      ? "bg-[#4CAF50] hover:bg-[#45a049] text-white border-[#4CAF50]" 
                      : "border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
                  }`}
                >
                  Completed
                </Button>
                <Button
                  variant={params.status === "REJECTED" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("REJECTED")}
                  className={`text-xs h-9 flex-1 sm:flex-none ${
                    params.status === "REJECTED" 
                      ? "bg-[#4CAF50] hover:bg-[#45a049] text-white border-[#4CAF50]" 
                      : "border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
                  }`}
                >
                  Rejected
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Tidak ada data</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1">
                {searchTerm 
                  ? `Tidak ada transaksi yang cocok dengan pencarian "${searchTerm}"`
                  : "Tidak ada data transaksi yang ditemukan. Coba gunakan filter yang berbeda atau refresh halaman."
                }
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredTransactions}
              pagination
              paginationServer={!searchTerm} // Use client pagination when searching
              paginationTotalRows={totalRows}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
              paginationPerPage={currentLimit}
              paginationRowsPerPageOptions={[10, 25, 50, 100]}
              responsive
              highlightOnHover
              pointerOnHover
              persistTableHead
              noHeader={isMobile}
              sortIcon={<ChevronDown size={16} />}
              defaultSortFieldId={1}
              paginationComponentOptions={{
                rowsPerPageText: "Baris per halaman:",
                rangeSeparatorText: "dari",
              }}
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: "#f9fafb",
                    borderBottom: "1px solid #e5e7eb",
                    fontWeight: "600",
                    color: "#374151",
                    fontSize: "0.875rem",
                  },
                },
                rows: {
                  style: {
                    minHeight: isMobile ? "120px" : "60px",
                    fontSize: "0.875rem",
                    color: "#111827",
                    "&:not(:last-of-type)": {
                      borderBottom: "1px solid #f3f4f6",
                    },
                  },
                },
                pagination: {
                  style: {
                    borderTop: "1px solid #e5e7eb",
                    fontSize: "0.875rem",
                  },
                },
                cells: {
                  style: {
                    paddingLeft: "16px",
                    paddingRight: "16px",
                  },
                },
              }}
            />
          )}
        </Card>
      </div>

      <TransactionDetailDialog
        open={detailOpen}
        setOpen={setDetailOpen}
        transaction={selectedTransaction}
        isLoading={dialogLoading}
      />

      <TransactionStatusDialog
        open={statusDialogOpen}
        setOpen={setStatusDialogOpen}
        transaction={selectedTransaction}
        onStatusUpdate={handleStatusUpdate}
        isLoading={dialogLoading}
      />

      {/* PDF Export Dialog */}
      {isPDFModalOpen && (
        <Suspense fallback={<div>Loading PDF Generator...</div>}>
          <PDFExport 
            isOpen={isPDFModalOpen}
            onClose={() => setIsPDFModalOpen(false)}
            transactions={prepareTransactionsForPDF()}
          />
        </Suspense>
      )}
    </div>
  );
}

export default History;