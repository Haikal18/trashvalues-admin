import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, RefreshCw, Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const getTransactionTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case "deposit":
      return { icon: <ArrowDownCircle className="h-4 w-4 text-green-500" />, label: "Deposit" };
    case "withdrawal":
      return { icon: <ArrowUpCircle className="h-4 w-4 text-red-500" />, label: "Penarikan" };
    case "reward":
      return { icon: <Wallet className="h-4 w-4 text-blue-500" />, label: "Reward" };
    default:
      return { icon: <Wallet className="h-4 w-4 text-gray-500" />, label: type || "Unknown" };
  }
};

const getStatusBadge = (status) => {
  const statusConfig = {
    PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", label: "Pending" },
    PROCESSING: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "Processing" },
    COMPLETED: { color: "bg-green-100 text-green-800 border-green-200", label: "Completed" },
    REJECTED: { color: "bg-red-100 text-red-800 border-red-200", label: "Rejected" },
  };

  const config = statusConfig[status] || { color: "bg-gray-100 text-gray-800 border-gray-200", label: status };

  return (
    <Badge className={`${config.color} text-xs font-medium border`}>
      {config.label}
    </Badge>
  );
};

export const getTransactionTableColumns = (
  openDetailDialog,
  openStatusDialog,
  isMobile,
  isTablet,
  prefetchTransaction // Add prefetch function parameter
) => {
  const mobileColumns = [
    {
      name: "Transaction",
      selector: (row) => row.id,
      grow: 1,
      cell: (row) => (
        <div className="py-2 pr-2 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full mr-2 bg-gray-100 flex items-center justify-center overflow-hidden">
                {row.user?.profileImage ? (
                  <img
                    src={row.user.profileImage}
                    alt={row.user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  row.user?.name?.charAt(0) || "U"
                )}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-medium text-sm truncate">
                  {row.user?.name || "Unknown User"}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(row.createdAt)}
                </span>
              </div>
            </div>
            {getStatusBadge(row.status)}
          </div>

          <div className="grid grid-cols-2 gap-1 text-sm mb-2">
            <div>
              <div className="text-xs text-gray-500">Tipe</div>
              <div className="flex items-center">
                {getTransactionTypeIcon(row.type).icon}
                <span className="ml-1 truncate">{getTransactionTypeIcon(row.type).label}</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Jumlah</div>
              <div className="font-medium text-green-600">
                {formatCurrency(row.amount)}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              ID: {row.id?.slice(-8) || "N/A"}
            </span>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openDetailDialog(row.id)}
                onMouseEnter={() => prefetchTransaction?.(row.id)} // Add preload on hover
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
                    onClick={() => openStatusDialog(row.id)}
                    onMouseEnter={() => prefetchTransaction?.(row.id)} // Add preload on hover
                  >
                    <RefreshCw className="h-4 w-4 mr-2" /> Ubah Status
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
      width: "200px",
      cell: (row) => (
        <div className="flex items-center py-1">
          <div className="h-8 w-8 rounded-full mr-2 bg-gray-100 flex items-center justify-center overflow-hidden">
            {row.user?.profileImage ? (
              <img
                src={row.user.profileImage}
                alt={row.user.name}
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
      name: "Tipe",
      selector: (row) => row.type,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <div className="flex items-center">
          <div className="mr-2">{getTransactionTypeIcon(row.type).icon}</div>
          <span>{getTransactionTypeIcon(row.type).label}</span>
        </div>
      ),
    },
    {
      name: "Jumlah",
      selector: (row) => row.amount,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span className="font-medium text-green-600">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "120px",
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
            onClick={() => openDetailDialog(row.id)}
            onMouseEnter={() => prefetchTransaction?.(row.id)} // Add preload on hover
            className="h-8 w-8"
            title="Detail Transaksi"
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
                onClick={() => openStatusDialog(row.id)}
                onMouseEnter={() => prefetchTransaction?.(row.id)} // Add preload on hover
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Ubah Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const desktopColumns = [
    {
      name: "Tanggal",
      selector: (row) => row.createdAt,
      sortable: true,
      width: "150px",
      cell: (row) => <div className="text-sm">{formatDate(row.createdAt)}</div>,
    },
    {
      name: "User",
      selector: (row) => row.user?.name || row.userId,
      sortable: true,
      width: "200px",
      cell: (row) => (
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full mr-3 bg-gray-100 flex items-center justify-center overflow-hidden">
            {row.user?.profileImage ? (
              <img
                src={row.user.profileImage}
                alt={row.user.name}
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
            <span className="text-xs text-gray-500">{row.user?.email}</span>
          </div>
        </div>
      ),
    },
    {
      name: "Tipe",
      selector: (row) => row.type,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <div className="flex items-center">
          <div className="mr-2">{getTransactionTypeIcon(row.type).icon}</div>
          <span>{getTransactionTypeIcon(row.type).label}</span>
        </div>
      ),
    },
    {
      name: "Jumlah",
      selector: (row) => row.amount,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span className="font-medium text-green-600">
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "120px",
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
            onClick={() => openDetailDialog(row.id)}
            onMouseEnter={() => prefetchTransaction?.(row.id)} // Add preload on hover
            className="h-8 w-8"
            title="Detail Transaksi"
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
                onClick={() => openStatusDialog(row.id)}
                onMouseEnter={() => prefetchTransaction?.(row.id)} // Add preload on hover
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Ubah Status
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