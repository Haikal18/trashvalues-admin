import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

// All fetch functions at the top level
const fetchUserStats = async () => {
  const response = await api.get("/users");
  return response.data.data || response.data;
};

const fetchDropoffStats = async () => {
  const response = await api.get("/dropoffs");
  return response.data.data || response.data;
};

const fetchTransactionStats = async () => {
  const response = await api.get("/transactions");
  return response.data.data || response.data;
};

const fetchWasteStats = async () => {
  const response = await api.get("/waste-types");
  return response.data.data || response.data;
};

const fetchRecentTransactions = async () => {
  // Limit to 4 most recent transactions
  const response = await api.get("/transactions?limit=4&sort=createdAt:desc");
  return response.data.data || response.data;
};

const fetchRecentDropoffs = async () => {
  // Limit to 4 most recent dropoffs
  const response = await api.get("/dropoffs?limit=4&sort=createdAt:desc");
  return response.data.data || response.data;
};

// All process functions at the top level
const processUserStats = (data) => {
  // Pastikan data adalah array
  if (!Array.isArray(data)) return { count: 0, activeUsers: 0, userGrowth: 0 };

  // Hitung statistik user
  const count = data.length;
  
  // Hitung pengguna aktif dalam 30 hari terakhir
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const activeUsers = data.filter(user => {
    const lastActiveDate = user.lastActive ? new Date(user.lastActive) : null;
    return lastActiveDate && lastActiveDate > thirtyDaysAgo;
  }).length;

  // Hitung pertumbuhan dibandingkan bulan sebelumnya (contoh sederhana)
  // Dalam implementasi sebenarnya, Anda mungkin memiliki data historis untuk dibandingkan
  const userGrowth = Math.round(Math.random() * 20 - 5); // Contoh: -5% hingga 15%
  
  return {
    count,
    activeUsers,
    userGrowth,
  };
};

const processDropoffStats = (data) => {
  // Pastikan data adalah array
  if (!Array.isArray(data)) return { count: 0, totalDropoffs: 0, dropoffGrowth: 0 };
  
  // Hitung statistik dropoff
  const count = data.length;
  
  // Hitung dropoff dalam 30 hari terakhir
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentDropoffs = data.filter(dropoff => {
    const date = dropoff.createdAt ? new Date(dropoff.createdAt) : null;
    return date && date > thirtyDaysAgo;
  }).length;
  
  // Hitung pertumbuhan
  const dropoffGrowth = Math.round(Math.random() * 25); // Contoh: 0% hingga 25%
  
  return {
    count,
    totalDropoffs: count,
    recentDropoffs,
    dropoffGrowth,
  };
};

const processTransactionStats = (data) => {
  // Pastikan data adalah array
  if (!Array.isArray(data)) return { count: 0, totalAmount: 0, transactionGrowth: 0 };
  
  // Hitung statistik transaksi
  const count = data.length;
  
  // Hitung total amount dari semua transaksi
  const totalAmount = data.reduce((sum, transaction) => {
    const amount = Number(transaction.amount) || 0;
    return sum + amount;
  }, 0);
  
  // Hitung pertumbuhan
  const transactionGrowth = Math.round(Math.random() * 30 - 10); // Contoh: -10% hingga 20%
  
  return {
    count,
    totalAmount,
    transactionGrowth,
  };
};

const processWasteStats = (data) => {
  // Pastikan data adalah array
  if (!Array.isArray(data)) return { count: 0, totalWeight: 0, wasteGrowth: 0 };
  
  // Hitung statistik sampah
  const count = data.length;
  
  // Hitung total berat
  let totalWeight = 0;
  let wasteTypes = {};
  
  // Jika data adalah waste types, ambil dari properti berbeda
  if (data.some(item => item.hasOwnProperty('weight'))) {
    // Data dropoffs dengan informasi waste
    totalWeight = data.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
    
    // Hitung tipe sampah
    data.forEach(item => {
      const type = item.wasteType || 'Unknown';
      if (!wasteTypes[type]) wasteTypes[type] = 0;
      wasteTypes[type] += Number(item.weight) || 0;
    });
  } else {
    // Data waste types
    data.forEach(type => {
      const collectedAmount = Number(type.collectedAmount) || 0;
      totalWeight += collectedAmount;
      wasteTypes[type.name || 'Unknown'] = collectedAmount;
    });
  }
  
  // Cari tipe sampah paling banyak
  let topWasteType = 'None';
  let topWasteAmount = 0;
  
  for (const [type, amount] of Object.entries(wasteTypes)) {
    if (amount > topWasteAmount) {
      topWasteAmount = amount;
      topWasteType = type;
    }
  }
  
  const topWastePercentage = totalWeight > 0 
    ? Math.round((topWasteAmount / totalWeight) * 100) 
    : 0;
  
  // Hitung pertumbuhan
  const wasteGrowth = Math.round(Math.random() * 20); // Contoh: 0% hingga 20%
  
  return {
    count,
    totalWeight,
    wasteGrowth,
    topWasteType,
    topWastePercentage,
  };
};

const processRecentTransactions = (data) => {
  if (!Array.isArray(data)) return [];
  
  return data.map(transaction => {
    // Format relative time
    const createdAt = new Date(transaction.createdAt);
    const now = new Date();
    const diffHours = Math.round((now - createdAt) / (1000 * 60 * 60));
    const relativeTime = diffHours <= 24 
      ? `${diffHours} jam yang lalu` 
      : `${Math.floor(diffHours / 24)} hari yang lalu`;
    
    return {
      id: transaction.id || transaction._id,
      user: {
        name: transaction.user?.name || "Unknown User",
        image: transaction.user?.profilePicture || `https://i.pravatar.cc/150?u=${transaction.userId}`,
      },
      amount: `Rp ${(transaction.amount || 0).toLocaleString('id-ID')}`,
      status: transaction.status || "PENDING",
      type: transaction.type || "DEPOSIT",
      date: relativeTime,
    };
  });
};

const processRecentDropoffs = (data) => {
  if (!Array.isArray(data)) return [];
  
  return data.map(dropoff => {
    // Format relative time
    const createdAt = new Date(dropoff.createdAt);
    const now = new Date();
    const diffHours = Math.round((now - createdAt) / (1000 * 60 * 60));
    const relativeTime = diffHours <= 24 
      ? `${diffHours} jam yang lalu` 
      : `${Math.floor(diffHours / 24)} hari yang lalu`;
    
    // Extract waste type info
    const wasteType = Array.isArray(dropoff.wasteItems) && dropoff.wasteItems.length > 0
      ? dropoff.wasteItems[0].wasteType?.name || "Mixed"
      : "Unknown";
    
    return {
      id: dropoff.id || dropoff._id,
      user: {
        name: dropoff.user?.name || "Unknown User",
        image: dropoff.user?.profilePicture || `https://i.pravatar.cc/150?u=${dropoff.userId}`,
      },
      wasteType: wasteType,
      weight: `${dropoff.totalWeight || 0} kg`,
      points: `${dropoff.totalAmount || 0}`,
      status: dropoff.status || "PENDING",
      date: relativeTime,
    };
  });
};

// The main hook
export function useDashboardStats() {
  // Define all queries consistently at the same level
  const userStatsQuery = useQuery({
    queryKey: ["userStats"],
    queryFn: fetchUserStats,
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to fetch user statistics");
    }
  });

  const dropoffStatsQuery = useQuery({
    queryKey: ["dropoffStats"],
    queryFn: fetchDropoffStats,
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to fetch dropoff statistics");
    }
  });

  const transactionStatsQuery = useQuery({
    queryKey: ["transactionStats"],
    queryFn: fetchTransactionStats,
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to fetch transaction statistics");
    }
  });

  const wasteStatsQuery = useQuery({
    queryKey: ["wasteStats"],
    queryFn: fetchWasteStats,
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to fetch waste statistics");
    }
  });

  const recentTransactionsQuery = useQuery({
    queryKey: ["recentTransactions"],
    queryFn: fetchRecentTransactions,
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to fetch recent transactions");
    }
  });

  const recentDropoffsQuery = useQuery({
    queryKey: ["recentDropoffs"],
    queryFn: fetchRecentDropoffs,
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to fetch recent dropoffs");
    }
  });

  // Process all data after queries
  const processedUserStats = userStatsQuery.data 
    ? processUserStats(userStatsQuery.data) 
    : {};
    
  const processedDropoffStats = dropoffStatsQuery.data 
    ? processDropoffStats(dropoffStatsQuery.data) 
    : {};
    
  const processedTransactionStats = transactionStatsQuery.data 
    ? processTransactionStats(transactionStatsQuery.data) 
    : {};
    
  const processedWasteStats = wasteStatsQuery.data 
    ? processWasteStats(wasteStatsQuery.data) 
    : {};

  const processedRecentTransactions = recentTransactionsQuery.data
    ? processRecentTransactions(recentTransactionsQuery.data)
    : [];

  const processedRecentDropoffs = recentDropoffsQuery.data
    ? processRecentDropoffs(recentDropoffsQuery.data)
    : [];

  // Optional: Add logs for debugging
  console.log("Raw Recent Transactions:", recentTransactionsQuery.data);
  console.log("Processed Recent Transactions:", processedRecentTransactions);
  console.log("Raw Recent Dropoffs:", recentDropoffsQuery.data);
  console.log("Processed Recent Dropoffs:", processedRecentDropoffs);

  // Return all processed data
  return {
    userStats: processedUserStats,
    dropoffStats: processedDropoffStats,
    transactionStats: processedTransactionStats,
    wasteStats: processedWasteStats,
    recentTransactions: processedRecentTransactions,
    recentDropoffs: processedRecentDropoffs,
    isLoading: 
      userStatsQuery.isLoading || 
      dropoffStatsQuery.isLoading || 
      transactionStatsQuery.isLoading || 
      wasteStatsQuery.isLoading ||
      recentTransactionsQuery.isLoading ||
      recentDropoffsQuery.isLoading,
    isError: 
      userStatsQuery.isError || 
      dropoffStatsQuery.isError || 
      transactionStatsQuery.isError || 
      wasteStatsQuery.isError ||
      recentTransactionsQuery.isError ||
      recentDropoffsQuery.isError
  };
}