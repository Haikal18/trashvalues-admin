import {
    Check,
    X,
    Clock,
    Loader2,
    RefreshCw,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
  } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { Badge } from "@/components/ui/badge";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { formatDate } from "@/lib/utils";
  
export const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="h-3 w-3 mr-1" />,
      },
      PROCESSING: {
        color: "bg-blue-100 text-blue-800",
        icon: <Loader2 className="h-3 w-3 mr-1 animate-spin" />,
      },
      COMPLETED: {
        color: "bg-green-100 text-green-800",
        icon: <Check className="h-3 w-3 mr-1" />,
      },
      REJECTED: {
        color: "bg-red-100 text-red-800",
        icon: <X className="h-3 w-3 mr-1" />,
      },
      CANCELLED: {
        color: "bg-gray-100 text-gray-800",
        icon: <X className="h-3 w-3 mr-1" />,
      },
    };
  
    const config = statusConfig[status] || statusConfig.PENDING;
  
    return (
      <Badge
        variant="outline"
        className={`${config.color} flex items-center border-none`}
      >
        {config.icon} {status}
      </Badge>
    );
};
  
export const getTableColumns = (openDetailDialog, openStatusDialog, openDeleteDialog, isMobile, isTablet) => {
    const mobileColumns = [
      {
        name: "Dropoff",
        sortable: true,
        grow: 1,
        cell: (row) => (
          <div className="py-2 pr-2 w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono text-gray-500">
                #{(row.id || row._id).substring(0, 6)}
              </span>
              {getStatusBadge(row.status)}
            </div>
  
            <div className="flex items-center mb-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2 overflow-hidden">
                {row.user?.profileImage ? (
                  <img
                    src={row.user.profileImage}
                    alt={row.user?.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  row.user?.name?.charAt(0) || "U"
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {row.user?.name || "Unknown User"}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(row.createdAt)}
                </span>
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-1 text-sm mb-2">
              <div>
                <div className="text-xs text-gray-500">Jenis Sampah</div>
                <div className="truncate">{row.wasteType}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Berat</div>
                <div>{row.weight} kg</div>
              </div>
            </div>
  
            <div className="flex justify-between items-center">
              <span className="font-medium text-green-600">
                {row.points} poin
              </span>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openDetailDialog(row.id || row._id)}
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
                    <DropdownMenuItem
                      onClick={() => openStatusDialog(row.id || row._id, row)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" /> Ubah Status
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => openDeleteDialog(row.id || row._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Hapus Dropoff
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        ),
      },
    ];
  
    const tabletColumns = [
      {
        name: "User",
        selector: (row) => row.user?.name || row.userId,
        sortable: true,
        grow: 1,
        cell: (row) => (
          <div className="flex items-center py-1">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs mr-2 overflow-hidden">
              {row.user?.profileImage ? (
                <img
                  src={row.user.profileImage}
                  alt={row.user?.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                row.user?.name?.charAt(0) || "U"
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {row.user?.name || "Unknown User"}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(row.createdAt)}
              </span>
            </div>
          </div>
        ),
      },
      {
        name: "Info",
        sortable: true,
        grow: 1,
        cell: (row) => (
          <div className="flex flex-col py-1">
            <div className="mb-1">{row.wasteType}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm">{row.weight} kg</span>
              <span className="text-sm text-green-600">{row.points} poin</span>
            </div>
          </div>
        ),
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        width: "130px",
        cell: (row) => getStatusBadge(row.status),
      },
      {
        name: "Aksi",
        width: "100px",
        cell: (row) => (
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDetailDialog(row.id || row._id)}
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
                <DropdownMenuItem
                  onClick={() => openStatusDialog(row.id || row._id)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Ubah Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => openDeleteDialog(row.id || row._id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Hapus Dropoff
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ];
  
    const desktopColumns = [
      {
        name: "User",
        selector: (row) => row.user?.name || row.userId,
        sortable: true,
        width: "180px",
        cell: (row) => (
          <div className="flex items-center py-1">
            <div className="flex flex-col">
              <span className="font-medium text-sm">
                {row.user?.name || "Unknown User"}
              </span>
              <span className="text-xs text-gray-500">{row.user?.email}</span>
            </div>
          </div>
        ),
      },
      {
        name: "Tanggal",
        selector: (row) => row.createdAt,
        sortable: true,
        width: "150px",
        cell: (row) => <div className="text-sm">{formatDate(row.createdAt)}</div>,
      },
      {
        name: "Jenis Sampah",
        selector: (row) => row.wasteType,
        sortable: true,
        width: "150px",
      },
      {
        name: "Berat (kg)",
        selector: (row) => row.weight,
        sortable: true,
        width: "100px",
        cell: (row) => <span className="font-medium">{row.weight} kg</span>,
      },
      {
        name: "Poin",
        selector: (row) => row.points,
        sortable: true,
        width: "100px",
        cell: (row) => (
          <span className="font-medium text-green-600">{row.points} poin</span>
        ),
      },
      {
        name: "Status",
        selector: (row) => row.status,
        sortable: true,
        width: "150px",
        cell: (row) => getStatusBadge(row.status),
      },
      {
        name: "Aksi",
        width: "120px",
        cell: (row) => (
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDetailDialog(row.id || row._id)}
              className="h-8 w-8"
              title="Detail Dropoff"
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
                <DropdownMenuItem
                  onClick={() => openStatusDialog(row.id || row._id)}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Ubah Status
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => openDeleteDialog(row.id || row._id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Hapus Dropoff
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ];
  
    if (isMobile) return mobileColumns;
    if (isTablet) return tabletColumns;
    return desktopColumns;
};