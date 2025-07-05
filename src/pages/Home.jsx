import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Package,
  Recycle,
  RefreshCw,
  Search,
  Upload,
  Users,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { formatCurrency } from "@/lib/utils";

function Home() {
  const navigate = useNavigate();
  const { 
    userStats, 
    dropoffStats, 
    transactionStats, 
    wasteStats,
    recentTransactions,
    recentDropoffs,
    isLoading, 
    isError 
  } = useDashboardStats();

  useEffect(() => {
    console.log("Home Component - Stats data:", {
      userStats,
      dropoffStats,
      transactionStats,
      wasteStats,
      recentTransactions,
      recentDropoffs
    });
  }, [userStats, dropoffStats, transactionStats, wasteStats, recentTransactions, recentDropoffs]);

  const dashboardStats = [
    {
      title: "Total Users",
      value: isLoading ? "Loading..." : userStats?.count || userStats?.totalUsers || 0,
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Total Dropoffs",
      value: isLoading ? "Loading..." : dropoffStats?.count || dropoffStats?.totalDropoffs || 0,
      icon: <Package className="h-4 w-4" />,
    },
    {
      title: "Total Earnings",
      value: isLoading ? "Loading..." : formatCurrency(transactionStats?.totalAmount || 0),
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      title: "Total Waste",
      value: isLoading ? "Loading..." : `${wasteStats?.totalWeight || 0} kg`,
      icon: <Recycle className="h-4 w-4" />,
    },
  ];

  const quickActions = [
    {
      title: "New Dropoff",
      description: "Record new waste dropoff",
      icon: <Package className="h-5 w-5" />,
      color: "bg-green-100 text-green-700",
      action: () => navigate("/dropoff"),
    },
    {
      title: "Process Transactions",
      description: "Manage pending transactions",
      icon: <RefreshCw className="h-5 w-5" />,
      color: "bg-blue-100 text-blue-700",
      action: () => navigate("/history"),
    },
    {
      title: "Manage Waste Types",
      description: "Edit recyclable materials",
      icon: <Recycle className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-700",
      action: () => navigate("/waste-types"),
    },
    {
      title: "Export Report",
      description: "Generate PDF reports",
      icon: <Upload className="h-5 w-5" />,
      color: "bg-orange-100 text-orange-700",
      action: () => navigate("/history"),
    },
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      COMPLETED: "bg-green-100 text-green-800 border-green-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <span
        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
          statusStyles[status] || ""
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {dashboardStats.map((stat, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex items-center justify-center h-20">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex flex-col gap-1 min-w-0 pr-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </span>
                        <span className="text-2xl font-bold truncate">
                          {stat.value}
                        </span>
                      </div>
                      <div
                        className="p-2 rounded-full bg-gray-100 text-gray-700 flex-shrink-0"
                      >
                        {stat.icon}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="mb-6">
        <Card className="shadow-sm mb-5">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              Quick Actions
            </CardTitle>
            <CardDescription>Shortcuts to common tasks</CardDescription>
          </CardHeader>
          <CardContent className="pb-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto px-4 py-3 flex flex-col items-start justify-start gap-1 border border-slate-200 shadow-sm hover:shadow-md transition-all"
                  onClick={action.action}
                >
                  <div className={`p-2 rounded-full ${action.color} mb-1`}>
                    {action.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Recent Activities
          </CardTitle>
          <CardDescription>Latest transactions and dropoffs</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="transactions">
            <div className="px-6">
              <TabsList className="w-full max-w-[400px] justify-start">
                <TabsTrigger value="transactions" className="flex-1">
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="dropoffs" className="flex-1">
                  Dropoffs
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="transactions" className="m-0">
              <div className="divide-y">
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : recentTransactions && recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 sm:px-6"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-sm">
                            {transaction.user.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.id} • {transaction.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div
                          className={`font-medium text-sm ${
                            transaction.type === "WITHDRAWAL"
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {transaction.type === "WITHDRAWAL" ? "-" : "+"}
                          {transaction.amount}
                        </div>
                        <div>{getStatusBadge(transaction.status)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    No recent transactions found
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="dropoffs" className="m-0">
              <div className="divide-y">
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : recentDropoffs && recentDropoffs.length > 0 ? (
                  recentDropoffs.map((dropoff) => (
                    <div
                      key={dropoff.id}
                      className="p-4 sm:px-6 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between"
                    >
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium text-sm">
                            {dropoff.user.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {dropoff.id} • {dropoff.date}
                          </div>
                        </div>
                      </div>
                      
                      {/* Dropoff Details - Mobile: Full width, Desktop: Right aligned */}
                      <div className="space-y-2 sm:space-y-1 sm:flex sm:flex-col sm:items-end sm:gap-1">
                        {/* Waste Info - Mobile: Stacked, Desktop: Inline */}
                        <div className="flex flex-col gap-1 sm:flex-row sm:gap-0 sm:text-sm">
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-muted-foreground font-medium">
                              {dropoff.wasteType}
                            </span>
                            <span className="hidden sm:inline"> • </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="font-medium">{dropoff.weight}</span>
                            <span className="hidden sm:inline"> • </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-green-600 font-medium">
                              {dropoff.points} pts
                            </span>
                          </div>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="flex justify-start sm:justify-end">
                          {getStatusBadge(dropoff.status)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    No recent dropoffs found
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;