import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useWasteTypes } from "@/hooks/use-waste-types";
import { formatCurrency } from "@/lib/utils";
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

  const columns = [
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
      enableHiding: true,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive");
        return (
          <Badge variant={isActive ? "success" : "destructive"}>
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
      enableHiding: true,
    },
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
      id: "actions",
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

  const getVisibleColumns = () => {
    if (window.innerWidth < 640) {
      return columns.filter(
        (col) =>
          !col.enableHiding &&
          col.accessorKey !== "createdAt" &&
          col.accessorKey !== "description"
      );
    } else if (window.innerWidth < 1024) {
      return columns.filter((col) => col.accessorKey !== "description");
    } else {
      return columns;
    }
  };

  const table = useReactTable({
    data: wasteTypes,
    columns: getVisibleColumns(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">Waste Types</h1>
          <Button onClick={openAddDialog}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>All Waste Types</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <WasteTypeTableSkeleton />
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
                          colSpan={getVisibleColumns().length}
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

            <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-sm text-gray-500">Rows per page</span>
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

              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <span className="text-sm text-gray-500">
                  Page {currentPage} of {metadata.totalPages || 1}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= (metadata.totalPages || 1)}
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
