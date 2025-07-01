import {
  Check,
  X,
  Clock,
  Loader2,
  RefreshCw,
  MoreHorizontal,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
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

export const getTransactionTypeIcon = (type) => {
  const typeConfig = {
    WITHDRAWAL: {
      icon: <ArrowUpCircle className="h-4 w-4 text-red-500" />,
      label: "Penarikan",
      color: "text-red-500",
    },
    DEPOSIT: {
      icon: <ArrowDownCircle className="h-4 w-4 text-green-500" />,
      label: "Deposit",
      color: "text-green-500",
    },
    DEFAULT: {
      icon: <CreditCard className="h-4 w-4 text-blue-500" />,
      label: "Transaksi",
      color: "text-blue-500",
    },
  };

  return typeConfig[type] || typeConfig.DEFAULT;
};

export const getTransactionTableColumns = (
  openDetailDialog,
  openStatusDialog,
  isMobile,
  isTablet
) => {
  const mobileColumns = [
    {
      name: "Transaksi",
      sortable: true,
      grow: 1,
      cell: (row) => (
        <div className="py-2 pr-2 w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-mono text-gray-500">
              #{(row.id || "").substring(0, 6)}
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

          <div className="flex items-center mb-2 bg-gray-50 p-2 rounded">
            <div
              className={`mr-2 ${
                getTransactionTypeIcon(row.type).color
              }`}
            >
              {getTransactionTypeIcon(row.type).icon}
            </div>
            <div>
              <div className="text-sm font-medium">
                {getTransactionTypeIcon(row.type).label}
              </div>
              <div className="text-xs text-gray-500">
                {row.type === "WITHDRAWAL"
                  ? `${row.bankName} - ${row.accountNumber}`
                  : row.description || "No description"}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span
              className={`font-medium ${
                row.type === "WITHDRAWAL" ? "text-red-600" : "text-green-600"
              }`}
            >
              {row.type === "WITHDRAWAL" ? "-" : "+"}
              {row.amount?.toLocaleString() || 0} poin
            </span>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openDetailDialog(row.id)}
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
        <span
          className={`font-medium ${
            row.type === "WITHDRAWAL" ? "text-red-600" : "text-green-600"
          }`}
        >
          {row.type === "WITHDRAWAL" ? "-" : "+"}
          {row.amount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "140px",
      cell: (row) => getStatusBadge(row.status),
    },
    {
      name: "Aksi",
      width: "100px",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDetailDialog(row.id)}
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
                onClick={() => openStatusDialog(row.id)}
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
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {row.user?.name || "Unknown User"}
            </span>
            <span className="text-xs text-gray-500">{row.user?.email}</span>
          </div>
      ),
    },
    {
      name: "Tipe",
      selector: (row) => row.type,
      sortable: true,
      width: "140px",
      cell: (row) => (
        <div className="flex items-center">
          <div className="mr-2">{getTransactionTypeIcon(row.type).icon}</div>
          <span>{getTransactionTypeIcon(row.type).label}</span>
        </div>
      ),
    },
    {
      name: "Detail",
      selector: (row) => row.description,
      sortable: false,
      grow: 1,
      cell: (row) => (
        <div className="text-sm">
          {row.type === "WITHDRAWAL"
            ? row.bankName && row.accountNumber
              ? `${row.bankName} - ${row.accountNumber} (${
                  row.accountHolderName || "Unknown"
                })`
              : "No bank details"
            : row.description || "No description"}
        </div>
      ),
    },
    {
      name: "Jumlah",
      selector: (row) => row.amount,
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span
          className={`font-medium ${
            row.type === "WITHDRAWAL" ? "text-red-600" : "text-green-600"
          }`}
        >
          {row.type === "WITHDRAWAL" ? "-" : "+"}
          {row.amount?.toLocaleString() || 0}
        </span>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      width: "140px",
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
            onClick={() => openDetailDialog(row.id)}
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
                onClick={() => openStatusDialog(row.id)}
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