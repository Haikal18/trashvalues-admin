import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useWasteTypes } from "@/hooks/use-waste-types";
import { formatCurrency, formatDate } from "@/lib/utils";
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
  Eye,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditWasteTypeDialog from "@/components/waste-types/EditWasteTypeDialog";
import DeleteWasteTypeDialog from "@/components/waste-types/DeleteWasteTypeDialog";
import AddWasteTypeDialog from "@/components/waste-types/AddWasteTypeDialog";
import WasteTypeTableSkeleton from "@/components/waste-types/WasteTypeTableSkeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Toaster } from "sonner";

export default function WasteTypes() {
  const {
    wasteTypes,
    metadata,
    isLoading,
    goToPage,
    changeLimit,
    currentPage,
    currentLimit,
    createWasteType,
    updateWasteType,
    deleteWasteType,
    isCreating,
    isUpdating,
    isDeleting,
  } = useWasteTypes();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWasteType, setSelectedWasteType] = useState(null);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const openAddDialog = () => {
    setAddDialogOpen(true);
  };

  const openEditDialog = (wasteType) => {
    setSelectedWasteType(wasteType);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (wasteType) => {
    setSelectedWasteType(wasteType);
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
    createWasteType(data);
    closeAddDialog();
  };

  const handleUpdate = (id, data) => {
    updateWasteType(id, data);
    closeEditDialog();
  };

  const handleDelete = (id) => {
    deleteWasteType(id);
    closeDeleteDialog();
  };

  // Mobile columns - card layout
  const mobileColumns = [
    {
      name: "Waste Type",
      sortable: true,
      grow: 1,
      cell: (row) => (
        <div className="py-2 pr-2 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                <img
                  src={row.image}
                  alt={row.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium text-sm truncate">{row.name}</span>
                <span className="text-xs text-gray-500">
                  {formatCurrency(row.pricePerKg)}/kg
                </span>
              </div>
            </div>
            <Badge 
              className={`text-xs ${
                row.isActive 
                  ? "bg-green-500 text-white hover:bg-green-600" 
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {row.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <div className="text-sm text-gray-600 mb-2 line-clamp-2">
            {row.description}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {formatDate(row.createdAt)}
            </span>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditDialog(row)}
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
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
          </div>
        </div>
      ),
    },
  ];

  // Tablet columns
  const tabletColumns = [
    {
      name: "Waste Type",
      selector: (row) => row.name,
      sortable: true,
      grow: 1,
      cell: (row) => (
        <div className="flex items-center py-1">
          <div className="h-10 w-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
            <img
              src={row.image}
              alt={row.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-sm">{row.name}</span>
            <span className="text-xs text-gray-500">
              {formatCurrency(row.pricePerKg)}/kg
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
            {row.description}
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className={`text-xs ${
                row.isActive 
                  ? "bg-green-500 text-white hover:bg-green-600" 
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {row.isActive ? "Active" : "Inactive"}
            </Badge>
            <span className="text-xs text-gray-500">
              {formatDate(row.createdAt)}
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "Actions",
      width: "100px",
      cell: (row) => (
        <div className="flex">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openEditDialog(row)}
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

  // Desktop columns (original table structure)
  const desktopColumns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <img
            src={row.getValue("image")}
            alt={row.getValue("name")}
            className="h-10 w-10 rounded-md object-cover"
          />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "pricePerKg",
      header: "Price Per Kg",
      cell: ({ row }) => (
        <div>{formatCurrency(row.getValue("pricePerKg"))}</div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">
          {row.getValue("description")}
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive");
        return (
          <Badge 
            className={`${
              isActive 
                ? "bg-green-500 text-white hover:bg-green-600" 
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <div>{format(date, "PPP")}</div>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const wasteType = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditDialog(wasteType)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openDeleteDialog(wasteType)}
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
    data: wasteTypes,
    columns: desktopColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Custom table component for mobile/tablet
  const ResponsiveTable = ({ data, columns }) => {
    if (isMobile) {
      // Mobile menggunakan card layout
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
      // Tablet menggunakan card layout yang lebih terstruktur
      return (
        <div className="space-y-3">
          {data.map((row, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between">
                {/* Kolom pertama - Waste Type info */}
                <div className="flex items-center flex-1 mr-4">
                  <div className="h-12 w-12 rounded-md overflow-hidden mr-3 flex-shrink-0">
                    <img
                      src={row.image}
                      alt={row.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-base">{row.name}</span>
                    <span className="text-sm text-gray-500">
                      {formatCurrency(row.pricePerKg)}/kg
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(row)}
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
              </div>

              {/* Info section */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {row.description}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`text-xs ${
                        row.isActive 
                          ? "bg-green-500 text-white hover:bg-green-600" 
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {row.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(row.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <>
      <div className="space-y-4 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-xl md:text-2xl font-bold">Waste Types</h1>
          <Button onClick={openAddDialog} className="w-full sm:w-auto bg-[#4CAF50] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">All Waste Types</CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-6">
            {isLoading ? (
              <WasteTypeTableSkeleton />
            ) : (
              <>
                {isMobile || isTablet ? (
                  <ResponsiveTable data={wasteTypes} columns={getColumns()} />
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
                              No waste types found.
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

      <AddWasteTypeDialog
        open={addDialogOpen}
        onClose={closeAddDialog}
        onCreate={handleCreate}
        isCreating={isCreating}
      />

      <EditWasteTypeDialog
        open={editDialogOpen}
        onClose={closeEditDialog}
        wasteType={selectedWasteType}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />

      <DeleteWasteTypeDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        wasteType={selectedWasteType}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      <Toaster position="top-right" richColors />
    </>
  );
}