// DashboardPage.tsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
  Filler,
);

interface DashboardStats {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number;
  averageSpentPerBooking: number;
  totalParkingHours: number;
  favoriteParking: {
    name: string;
    count: number;
  } | null;
  recentActivity: {
    date: string;
    count: number;
  }[];
  bookingTrends: {
    month: string;
    bookings: number;
    spent: number;
  }[];
  parkingTypeDistribution: {
    type: string;
    count: number;
  }[];
  hourlyDistribution: {
    hour: string;
    bookings: number;
  }[];
  durationAnalysis: {
    range: string;
    count: number;
  }[];
  monthlyComparison: {
    month: string;
    currentYear: number;
    lastYear: number;
  }[];
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">(
    "month",
  );
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchDashboardData();
  }, [timeframe]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${API}/api/dashboard/user-stats?timeframe=${timeframe}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (data.success) {
        setStats(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#191919] via-[#0f0f0f] to-[#191919] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-linear-to-r from-[#1B42CB] to-[#FF2F6C] animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[#191919]"></div>
            </div>
          </div>
          <p className="mt-6 text-[#EEECF6] text-lg font-semibold">
            Loading your dashboard...
          </p>
          <p className="text-[#EEECF6]/60 mt-2">Analyzing your parking data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#191919] via-[#0f0f0f] to-[#191919] flex items-center justify-center p-4">
        <div className="backdrop-blur-xl bg-[#1B42CB]/10 border border-[#1B42CB]/30 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-[#1B42CB]/10">
          <div className="text-center">
            <div className="w-20 h-20 bg-linear-to-br from-[#FF2F6C]/20 to-[#1B42CB]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#FF2F6C]/30">
              <span className="text-3xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-[#EEECF6] mb-3">
              Dashboard Error
            </h2>
            <p className="text-[#EEECF6]/70 mb-6">{error}</p>
            <button
              onClick={() => fetchDashboardData()}
              className="px-6 py-3 bg-linear-to-r from-[#1B42CB] to-[#1B42CB]/80 text-white font-semibold rounded-xl hover:from-[#1B42CB]/90 hover:to-[#1B42CB]/70 transition-all duration-300 hover:shadow-lg hover:shadow-[#1B42CB]/20"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chart configurations
  const pieChartData = {
    labels: ["Active", "Completed", "Cancelled"],
    datasets: [
      {
        data: [
          stats?.activeBookings || 0,
          stats?.completedBookings || 0,
          stats?.cancelledBookings || 0,
        ],
        backgroundColor: [
          "rgba(27, 66, 203, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(255, 47, 108, 0.8)",
        ],
        borderColor: [
          "rgba(27, 66, 203, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(255, 47, 108, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: stats?.bookingTrends?.map((item) => item.month) || [],
    datasets: [
      {
        label: "Bookings",
        data: stats?.bookingTrends?.map((item) => item.bookings) || [],
        backgroundColor: "rgba(27, 66, 203, 0.8)",
        borderColor: "rgba(27, 66, 203, 1)",
        borderWidth: 1,
      },
      {
        label: "Amount Spent (₹)",
        data: stats?.bookingTrends?.map((item) => item.spent) || [],
        backgroundColor: "rgba(255, 47, 108, 0.8)",
        borderColor: "rgba(255, 47, 108, 1)",
        borderWidth: 1,
      },
    ],
  };

  const hourlyChartData = {
    labels: stats?.hourlyDistribution?.map((item) => item.hour) || [],
    datasets: [
      {
        label: "Bookings",
        data: stats?.hourlyDistribution?.map((item) => item.bookings) || [],
        backgroundColor: "rgba(27, 66, 203, 0.6)",
        borderColor: "rgba(27, 66, 203, 1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const durationChartData = {
    labels: stats?.durationAnalysis?.map((item) => item.range) || [],
    datasets: [
      {
        label: "Number of Bookings",
        data: stats?.durationAnalysis?.map((item) => item.count) || [],
        backgroundColor: "rgba(255, 47, 108, 0.6)",
        borderColor: "rgba(255, 47, 108, 1)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#EEECF6",
          font: {
            size: 12,
          },
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(238, 236, 246, 0.1)",
        },
        ticks: {
          color: "#EEECF6",
        },
      },
      x: {
        grid: {
          color: "rgba(238, 236, 246, 0.1)",
        },
        ticks: {
          color: "#EEECF6",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#191919] via-[#0f0f0f] to-[#191919] p-4 md:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#1B42CB]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FF2F6C]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="backdrop-blur-xl bg-[#1B42CB]/10 border border-[#1B42CB]/20 rounded-2xl p-6 md:p-8 shadow-2xl shadow-[#1B42CB]/10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#1B42CB] to-[#FF2F6C] flex items-center justify-center">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-[#EEECF6] to-[#1B42CB] bg-clip-text text-transparent">
                      Analytics Dashboard
                    </h1>
                    <p className="text-[#EEECF6]/60">
                      Track your parking habits and spending
                    </p>
                  </div>
                </div>
              </div>

              {/* Time Filter */}
              <div className="flex gap-2 bg-[#191919]/80 border border-[#1B42CB]/30 rounded-xl p-1">
                {["week", "month", "year"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeframe(period as any)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                      timeframe === period
                        ? "bg-linear-to-r from-[#1B42CB] to-[#FF2F6C] text-white"
                        : "text-[#EEECF6]/60 hover:text-[#EEECF6] hover:bg-white/5"
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="backdrop-blur-xl bg-[#191919]/60 border border-[#1B42CB]/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-[#1B42CB]/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#1B42CB]/20 flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <span className="text-3xl font-bold text-[#EEECF6]">
                {stats?.totalBookings || 0}
              </span>
            </div>
            <h3 className="text-[#EEECF6]/60 text-sm">Total Bookings</h3>
          </div>

          <div className="backdrop-blur-xl bg-[#191919]/60 border border-[#1B42CB]/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-[#1B42CB]/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <span className="text-3xl font-bold text-[#EEECF6]">
                {stats?.completedBookings || 0}
              </span>
            </div>
            <h3 className="text-[#EEECF6]/60 text-sm">Completed</h3>
          </div>

          <div className="backdrop-blur-xl bg-[#191919]/60 border border-[#1B42CB]/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-[#1B42CB]/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#FF2F6C]/20 flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-3xl font-bold text-[#EEECF6]">
                ₹{stats?.totalSpent || 0}
              </span>
            </div>
            <h3 className="text-[#EEECF6]/60 text-sm">Total Spent</h3>
          </div>

          <div className="backdrop-blur-xl bg-[#191919]/60 border border-[#1B42CB]/20 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-[#1B42CB]/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <span className="text-2xl">⏰</span>
              </div>
              <span className="text-3xl font-bold text-[#EEECF6]">
                {stats?.totalParkingHours || 0}h
              </span>
            </div>
            <h3 className="text-[#EEECF6]/60 text-sm">Total Hours</h3>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Booking Status Distribution */}
          <div className="backdrop-blur-xl bg-[#191919]/60 border border-[#1B42CB]/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#EEECF6] mb-6">
              Booking Status Distribution
            </h3>
            <div className="h-64">
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>

          {/* Favorite Parking */}
          <div className="backdrop-blur-xl bg-[#191919]/60 border border-[#1B42CB]/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#EEECF6] mb-6">
              Favorite Parking Location
            </h3>
            {stats?.favoriteParking ? (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-xl bg-linear-to-br from-[#1B42CB] to-[#FF2F6C] flex items-center justify-center">
                  <span className="text-3xl">🏆</span>
                </div>
                <h4 className="text-2xl font-bold text-[#EEECF6] mb-2">
                  {stats.favoriteParking.name}
                </h4>
                <p className="text-[#EEECF6]/60">
                  Booked {stats.favoriteParking.count} times
                </p>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-[#EEECF6]/40">
                No data available
              </div>
            )}
          </div>

          {/* Booking Trends */}
          <div className="backdrop-blur-xl bg-[#191919]/60 border border-[#1B42CB]/20 rounded-2xl p-6 shadow-xl lg:col-span-2">
            <h3 className="text-xl font-bold text-[#EEECF6] mb-6">
              Booking & Spending Trends
            </h3>
            <div className="h-80">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>

          {/* Hourly Distribution */}
          <div className="backdrop-blur-xl bg-[#191919]/60 border border-[#1B42CB]/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#EEECF6] mb-6">
              Peak Booking Hours
            </h3>
            <div className="h-64">
              <Line data={hourlyChartData} options={chartOptions} />
            </div>
          </div>

          {/* Duration Analysis */}
          <div className="backdrop-blur-xl bg-[#191919]/60 border border-[#1B42CB]/20 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-[#EEECF6] mb-6">
              Parking Duration Analysis
            </h3>
            <div className="h-64">
              <Bar data={durationChartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Additional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="backdrop-blur-xl bg-linear-to-br from-[#1B42CB]/10 to-transparent border border-[#1B42CB]/20 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#1B42CB]/20 flex items-center justify-center">
                <span className="text-lg">📊</span>
              </div>
              <h4 className="text-lg font-semibold text-[#EEECF6]">
                Average per Booking
              </h4>
            </div>
            <p className="text-3xl font-bold text-[#EEECF6]">
              ₹{stats?.averageSpentPerBooking || 0}
            </p>
            <p className="text-sm text-[#EEECF6]/40 mt-2">
              Per booking average
            </p>
          </div>

          <div className="backdrop-blur-xl bg-linear-to-br from-[#FF2F6C]/10 to-transparent border border-[#FF2F6C]/20 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FF2F6C]/20 flex items-center justify-center">
                <span className="text-lg">⏱️</span>
              </div>
              <h4 className="text-lg font-semibold text-[#EEECF6]">
                Active Bookings
              </h4>
            </div>
            <p className="text-3xl font-bold text-[#EEECF6]">
              {stats?.activeBookings || 0}
            </p>
            <p className="text-sm text-[#EEECF6]/40 mt-2">Currently active</p>
          </div>

          <div className="backdrop-blur-xl bg-linear-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-lg">✓</span>
              </div>
              <h4 className="text-lg font-semibold text-[#EEECF6]">
                Completion Rate
              </h4>
            </div>
            <p className="text-3xl font-bold text-[#EEECF6]">
              {stats?.totalBookings
                ? Math.round(
                    (stats.completedBookings / stats.totalBookings) * 100,
                  )
                : 0}
              %
            </p>
            <p className="text-sm text-[#EEECF6]/40 mt-2">Of total bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
