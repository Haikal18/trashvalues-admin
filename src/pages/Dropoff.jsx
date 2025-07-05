import { useState, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useDropoffManagement } from "@/hooks/use-dropoff-management";
import { formatDate } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  ArrowLeft,
  ArrowRight,
  MoreHorizontal,
  Pencil,
  Trash2,
  Plus,
  Eye,
  Search,
  RefreshCw,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Toaster } from "@/components/ui/sonner";

// Import Dialogs
import AddDropoffDialog from "@/components/dropoff/AddDropoffDialog";
import EditDropoffStatusDialog from "@/components/dropoff/EditDropoffStatusDialog";
import DeleteDropoffDialog from "@/components/dropoff/DeleteDropoffDialog";
import DropoffDetailDialog from "@/components/dropoff/DropoffDetailDialog";

export default function Dropoff() {
  const {
    dropoffs,
    metadata,
    isLoading,
    currentPage,
    currentLimit,
    currentStatus,
    currentSearch,
    handleCreateDropoff,
    handleUpdateStatus,
    handleDeleteDropoff,
    handleGetDropoffById,
    goToPage,
    changeLimit,
    changeStatus,
    refetch,
    isCreating,
    isUpdatingStatus,
    isDeleting,
  } = useDropoffManagement();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editStatusDialogOpen, setEditStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDropoff, setSelectedDropoff] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  // Client-side filtering berdasarkan search input
  const filteredDropoffs = useMemo(() => {
    if (!searchInput.trim()) {
      return dropoffs;
    }

    const searchTerm = searchInput.toLowerCase();
    return dropoffs.filter(dropoff => {
      const addressMatch = dropoff.pickupAddress?.toLowerCase().includes(searchTerm);
      const userNameMatch = dropoff.user?.name?.toLowerCase().includes(searchTerm);
      return addressMatch || userNameMatch;
    });
  }, [dropoffs, searchInput]);

  // Status badge helper
  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800", 
      COMPLETED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      CANCELLED: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={statusConfig[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  // Dialog handlers
  const openAddDialog = () => setAddDialogOpen(true);
  const closeAddDialog = () => setAddDialogOpen(false);

  const openEditStatusDialog = (dropoff) => {
    setSelectedDropoff(dropoff);
    setEditStatusDialogOpen(true);
  };
  const closeEditStatusDialog = () => {
    setEditStatusDialogOpen(false);
    setSelectedDropoff(null);
  };

  const openDeleteDialog = (dropoff) => {
    setSelectedDropoff(dropoff);
    setDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedDropoff(null);
  };

  const openDetailDialog = async (id) => {
    try {
      const dropoffData = await handleGetDropoffById(id);
      setSelectedDropoff(dropoffData);
      setDetailDialogOpen(true);
    } catch (error) {
      console.error("Error loading dropoff details:", error);
    }
  };
  const closeDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedDropoff(null);
  };

  // Action handlers
  const handleCreate = (data) => {
    handleCreateDropoff(data);
    closeAddDialog();
  };

  const handleUpdateStatusAction = (id, status) => {
    handleUpdateStatus(id, status);
    closeEditStatusDialog();
  };

  const handleDelete = (id) => {
    handleDeleteDropoff(id);
    closeDeleteDialog();
  };

  // Search handler - hanya untuk clear search
  const clearSearch = () => {
    setSearchInput("");
  };

  // Status filter handler - handle empty string conversion
  const handleStatusChange = (value) => {
    const statusValue = value === "ALL" ? "" : value;
    changeStatus(statusValue);
  };

  // Table columns for desktop
  const desktopColumns = [
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.getValue("user");
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">{user?.name || "Unknown"}</span>
            <span className="text-xs text-gray-500">{user?.email || "-"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "pickupAddress",
      header: "Alamat Pickup",
      cell: ({ row }) => (
        <div className="max-w-[200px]">
          <p className="text-sm text-gray-600 line-clamp-2">
            {row.getValue("pickupAddress")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "pickupDate",
      header: "Tanggal Pickup",
      cell: ({ row }) => (
        <div className="text-sm">{formatDate(row.getValue("pickupDate"))}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "createdAt",
      header: "Dibuat",
      cell: ({ row }) => (
        <div className="text-sm">{formatDate(row.getValue("createdAt"))}</div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const dropoff = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDetailDialog(dropoff.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditStatusDialog(dropoff)}>
                <Pencil className="mr-2 h-4 w-4" />
                Ubah Status
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDeleteDialog(dropoff)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredDropoffs, // Gunakan data yang sudah difilter
    columns: desktopColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Mobile/Tablet responsive component
  const ResponsiveTable = ({ data }) => {
    if (isMobile) {
      return (
        <div className="space-y-3">
          {data.map((dropoff) => (
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-xs text-gray-500">
                    {dropoff.user?.name || "Unknown User"}
                  </div>
                </div>
                {getStatusBadge(dropoff.status)}
              </div>
              
              <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                {dropoff.pickupAddress}
              </div>
              
              <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                <span>Pickup: {formatDate(dropoff.pickupDate)}</span>
                <span>Dibuat: {formatDate(dropoff.createdAt)}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDetailDialog(dropoff.id)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Detail
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditStatusDialog(dropoff)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Ubah Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(dropoff)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Tablet view
    return (
      <div className="space-y-3">
        {data.map((dropoff) => (
          <div key={dropoff.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusBadge(dropoff.status)}
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  User: {dropoff.user?.name || "Unknown"}
                </div>
                <div className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {dropoff.pickupAddress}
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Pickup: {formatDate(dropoff.pickupDate)}</span>
                  <span>Dibuat: {formatDate(dropoff.createdAt)}</span>
                </div>
              </div>
              <div className="flex gap-1 ml-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openDetailDialog(dropoff.id)}
                  className="h-8 w-8"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditStatusDialog(dropoff)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Ubah Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => openDeleteDialog(dropoff)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const LoadingSkeleton = () => {
    if (isMobile) {
      // Mobile skeleton - matches mobile card layout
      return (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 bg-white">
              {/* Header with user and status */}
              <div className="flex justify-between items-start mb-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              
              {/* Address */}
              <div className="space-y-2 mb-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
              
              {/* Dates */}
              <div className="flex justify-between items-center mb-3">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Skeleton className="h-8 flex-1" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isTablet) {
      // Tablet skeleton - matches tablet layout
      return (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Status badge */}
                  <div className="mb-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                  
                  {/* User */}
                  <Skeleton className="h-4 w-32 mb-1" />
                  
                  {/* Address */}
                  <div className="space-y-1 mb-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                  
                  {/* Dates */}
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-1 ml-3">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Desktop skeleton - matches table layout
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-16" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-60" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold">Manajemen Dropoff</h1>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Daftar Dropoff</CardTitle>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              {/* Search */}
              <div className="flex gap-2 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari berdasarkan alamat atau nama user..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pl-10"
                  />
                  {searchInput && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <Select 
                value={currentStatus || "ALL"} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh Button */}
              <Button variant="outline" onClick={refetch} size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-3 md:p-6">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                {isMobile || isTablet ? (
                  <ResponsiveTable data={filteredDropoffs} />
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <TableHead key={header.id}>
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                              </TableHead>
                            ))}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {table.getRowModel().rows?.length ? (
                          table.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={desktopColumns.length}
                              className="h-24 text-center"
                            >
                              {searchInput ? 
                                `Tidak ada dropoff yang cocok dengan pencarian "${searchInput}"` : 
                                "Tidak ada dropoff ditemukan."
                              }
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-gray-500 whitespace-nowrap">Rows per page</span>
                <Select
                  value={currentLimit.toString()}
                  onValueChange={(value) => changeLimit(parseInt(value))}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={currentLimit} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {searchInput ? 
                    `Menampilkan ${filteredDropoffs.length} dari ${dropoffs.length} hasil` :
                    `Page ${currentPage} of ${Math.ceil((metadata.total || 0) / currentLimit)}`
                  }
                </span>
                {!searchInput && (
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage <= 1}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= Math.ceil((metadata.total || 0) / currentLimit)}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AddDropoffDialog
        open={addDialogOpen}
        onClose={closeAddDialog}
        onCreate={handleCreate}
        isCreating={isCreating}
      />

      <EditDropoffStatusDialog
        open={editStatusDialogOpen}
        onClose={closeEditStatusDialog}
        dropoff={selectedDropoff}
        onUpdate={handleUpdateStatusAction}
        isUpdating={isUpdatingStatus}
      />

      <DeleteDropoffDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        dropoff={selectedDropoff}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      <DropoffDetailDialog
        open={detailDialogOpen}
        onClose={closeDetailDialog}
        dropoff={selectedDropoff}
      />

      <Toaster position="top-right" richColors />
    </>
  );
}