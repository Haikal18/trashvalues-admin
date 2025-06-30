import DataTable from "react-data-table-component";
import { useDropoffs } from "@/hooks/use-dropoffs";
import {
  RefreshCw,
  Search,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import DropoffDetailDialog from "@/components/dropoff/DropoffDetailDialog";
import DropoffStatusDialog from "@/components/dropoff/DropoffStatusDialog";
import DropoffDeleteDialog from "@/components/dropoff/DropoffDeleteDialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDropoffDialogs } from "@/hooks/use-dropoff-dialogs";
import { getTableColumns } from "@/components/dropoff/dropoff-table-config";
import { useState, useEffect } from "react";

function Dropoff() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  
  // Tambahkan state untuk client-side search
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDropoffs, setFilteredDropoffs] = useState([]);

  const {
    dropoffs,
    loading,
    totalRows,
    fetchDropoffs,
    handlePageChange,
    handlePerRowsChange,
    handleStatusFilterChange,
    handleSearch: apiHandleSearch,
    updateDropoffStatus,
    deleteDropoff,
    getDropoffById,
    selectedDropoff,
    params,
  } = useDropoffs();

  // Update filtered dropoffs whenever the original dropoffs change or search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDropoffs(dropoffs);
      return;
    }

    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = dropoffs.filter(dropoff => {
      // Search in user name and email
      const userNameMatch = dropoff.user?.name?.toLowerCase().includes(lowercasedSearchTerm);
      const userEmailMatch = dropoff.user?.email?.toLowerCase().includes(lowercasedSearchTerm);
      
      // Search in location, address, notes
      const locationMatch = dropoff.location?.toLowerCase().includes(lowercasedSearchTerm);
      const addressMatch = dropoff.address?.toLowerCase().includes(lowercasedSearchTerm);
      const notesMatch = dropoff.notes?.toLowerCase().includes(lowercasedSearchTerm);
      
      // Search in weight and status
      const weightMatch = dropoff.weight?.toString().includes(lowercasedSearchTerm);
      const statusMatch = dropoff.status?.toLowerCase().includes(lowercasedSearchTerm);
      
      // Search in date (formatted as string)
      const dateMatch = new Date(dropoff.createdAt)
        .toLocaleDateString('id-ID', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
        .toLowerCase()
        .includes(lowercasedSearchTerm);
      
      // Return true if any field matches
      return userNameMatch || userEmailMatch || locationMatch || addressMatch || 
             notesMatch || weightMatch || statusMatch || dateMatch;
    });
    
    setFilteredDropoffs(filtered);
  }, [dropoffs, searchTerm]);

  // Client-side search handler
  const handleLocalSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const {
    detailOpen,
    setDetailOpen,
    statusDialogOpen,
    setStatusDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    openDetailDialog,
    openStatusDialog,
    openDeleteDialog,
    handleStatusUpdate,
    handleDelete,
  } = useDropoffDialogs(updateDropoffStatus, deleteDropoff, getDropoffById);

  const columns = getTableColumns(
    openDetailDialog,
    openStatusDialog,
    openDeleteDialog,
    isMobile,
    isTablet
  );

  return (
    <div className="p-4 md:p-6">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">Kelola Dropoff</h1>
          <Button
            onClick={fetchDropoffs}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {!isMobile && "Refresh"}
          </Button>
        </div>

        <Card className="shadow-sm">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Cari dropoff..."
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
                  className="text-xs h-9 flex-1 sm:flex-none"
                >
                  Semua
                </Button>
                <Button
                  variant={params.status === "PENDING" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("PENDING")}
                  className="text-xs h-9 flex-1 sm:flex-none"
                >
                  Pending
                </Button>
                <Button
                  variant={params.status === "PROCESSING" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("PROCESSING")}
                  className="text-xs h-9 flex-1 sm:flex-none"
                >
                  Processing
                </Button>
                <Button
                  variant={params.status === "COMPLETED" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("COMPLETED")}
                  className="text-xs h-9 flex-1 sm:flex-none"
                >
                  Completed
                </Button>
                <Button
                  variant={params.status === "REJECTED" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStatusFilterChange("REJECTED")}
                  className="text-xs h-9 flex-1 sm:flex-none"
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
          ) : dropoffs.length === 0 ? (
            <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Tidak ada data</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1">
                Tidak ada data dropoff yang ditemukan. Coba gunakan filter yang
                berbeda atau refresh halaman.
              </p>
            </div>
          ) : filteredDropoffs.length === 0 && searchTerm ? (
            <div className="p-8 md:p-12 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Tidak ada data</h3>
              <p className="text-sm text-muted-foreground max-w-md mt-1">
                Tidak ada transaksi yang cocok dengan pencarian "{searchTerm}"
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredDropoffs}
              pagination
              paginationServer={!searchTerm} // Use client pagination when searching
              paginationTotalRows={searchTerm ? filteredDropoffs.length : totalRows}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
              paginationPerPage={params.limit}
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

      <DropoffDetailDialog
        open={detailOpen}
        setOpen={setDetailOpen}
        dropoff={selectedDropoff}
      />

      <DropoffStatusDialog
        open={statusDialogOpen}
        setOpen={setStatusDialogOpen}
        dropoff={selectedDropoff}
        onStatusUpdate={handleStatusUpdate}
      />

      <DropoffDeleteDialog
        open={deleteDialogOpen}
        setOpen={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Dropoff;