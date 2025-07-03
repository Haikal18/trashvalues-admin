import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useWasteBanks } from "@/hooks/use-waste-banks";
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
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddWasteBankDialog from "@/components/waste-banks/AddWasteBankDialog";
import EditWasteBankDialog from "@/components/waste-banks/EditWasteBankDialog";
import DeleteWasteBankDialog from "@/components/waste-banks/DeleteWasteBankDialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "sonner";

export default function BankSampah() {
  const {
    wasteBanks,
    metadata,
    isLoading,
    goToPage,
    changeLimit,
    currentPage,
    currentLimit,
    createWasteBank,
    updateWasteBank,
    deleteWasteBank,
    isCreating,
    isUpdating,
    isDeleting,
  } = useWasteBanks();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWasteBank, setSelectedWasteBank] = useState(null);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const openAddDialog = () => {
    setAddDialogOpen(true);
  };

  const openEditDialog = (wasteBank) => {
    setSelectedWasteBank(wasteBank);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (wasteBank) => {
    setSelectedWasteBank(wasteBank);
    setDeleteDialogOpen(true);
  };

  const closeAddDialog = () => {
    setAddDialogOpen(false);
  };

  const closeEditDialog = () => {
    setEditDialogOpen(false);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleCreate = (data) => {
    createWasteBank(data);
    closeAddDialog();
  };

  const handleUpdate = (id, data) => {
    updateWasteBank(id, data);
    closeEditDialog();
  };

  const handleDelete = (id) => {
    deleteWasteBank(id);
    closeDeleteDialog();
  };

  // Mobile columns - card layout
    const mobileColumns = [
    {
        name: "Bank Sampah",
        sortable: true,
        grow: 1,
        cell: (row) => (
        <div className="py-2 pr-2 w-full">
            <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
                <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium text-sm truncate">{row.name}</span>
                <span className="text-xs text-gray-500 truncate">
                    {row.address}
                </span>
                </div>
            </div>
            {/* Action pindah ke kanan */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEditDialog(row)}>
                    <Pencil className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => openDeleteDialog(row)}
                >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>

            <div className="text-sm text-gray-600 mb-2 line-clamp-2">
            {row.address}
            </div>
        </div>
        ),
    },
    ];

  // Tablet columns
  const tabletColumns = [
    {
      name: "Bank Sampah",
      selector: (row) => row.name,
      sortable: true,
      grow: 1,
      cell: (row) => (
        <div className="flex items-center py-1">
          <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
            <MapPin className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm">{row.name}</span>
            <span className="text-xs text-gray-500 truncate">
              {row.address}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "Info",
      sortable: false,
      grow: 1,
      cell: (row) => (
        <div className="flex flex-col py-1">
          <div className="text-sm text-gray-600 mb-1 line-clamp-1">
            {row.address}
          </div>
        </div>
      ),
    },
    {
      name: "Actions",
      width: "100px",
      cell: (row) => (
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditDialog(row)}>
                <Pencil className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => openDeleteDialog(row)}
              >
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  // Desktop columns (TanStack Table structure)
  const desktopColumns = [
    {
      accessorKey: "name",
      header: "Nama Bank Sampah",
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
            <MapPin className="h-5 w-5 text-green-600" />
          </div>
          <div className="font-medium">{row.getValue("name")}</div>
        </div>
      ),
    },
    {
      accessorKey: "address",
      header: "Alamat",
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <p className="text-sm text-gray-600 line-clamp-2">
            {row.getValue("address")}
          </p>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: ({ row }) => {
        const wasteBank = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditDialog(wasteBank)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDeleteDialog(wasteBank)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const getColumns = () => {
    if (isMobile) return mobileColumns;
    if (isTablet) return tabletColumns;
    return desktopColumns;
  };

  const table = useReactTable({
    data: wasteBanks,
    columns: desktopColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Custom table component for mobile/tablet
  const ResponsiveTable = ({ data, columns }) => {
    if (isMobile) {
      return (
        <div className="space-y-2">
          {data.map((row, index) => (
            <div key={index} className="border rounded-lg p-3 bg-white">
              {columns[0].cell(row)}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="space-y-3">
          {data.map((row, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center flex-1 mr-4">
                  {columns[0].cell(row)}
                </div>
                <div className="flex items-center space-x-2">
                  {columns[2].cell(row)}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100">
                {columns[1].cell(row)}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-md" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-60" />
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="space-y-4 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold">Bank Sampah</h1>
          <Button 
            onClick={openAddDialog} 
            className="w-full sm:w-auto bg-[#4CAF50] text-white hover:bg-[#45A049]"
          >
            <Plus className="mr-2 h-4 w-4" /> Tambah Bank Sampah
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Daftar Bank Sampah</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                {isMobile || isTablet ? (
                  <ResponsiveTable data={wasteBanks} columns={getColumns()} />
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
                              Tidak ada bank sampah ditemukan.
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

              <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  Page {currentPage} of {metadata.totalPages || 1}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="h-8 w-8"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= (metadata.totalPages || 1)}
                    className="h-8 w-8"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddWasteBankDialog
        open={addDialogOpen}
        onClose={closeAddDialog}
        onCreate={handleCreate}
        isCreating={isCreating}
      />

      <EditWasteBankDialog
        open={editDialogOpen}
        onClose={closeEditDialog}
        wasteBank={selectedWasteBank}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />

      <DeleteWasteBankDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        wasteBank={selectedWasteBank}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      <Toaster position="top-right" richColors />
    </>
  );
}