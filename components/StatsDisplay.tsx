"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { wsClient } from "@/lib/websocket";
import { TradingStats } from "@/types";

export default function StatsDisplay() {
  const [stats, setStats] = useState<TradingStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await apiClient.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Connect WebSocket for live updates
    wsClient.connect();
    wsClient.on("stats_update", (data) => {
      setStats(data.stats);
    });

    return () => {
      wsClient.off("stats_update", () => {});
    };
  }, []);

  const handleReset = async () => {
    if (!confirm("Are you sure you want to reset all trading stats?")) return;

    try {
      await apiClient.resetStats();
      await fetchStats();
    } catch (error) {
      alert("Failed to reset stats");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading stats...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">No stats available</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Net Profit"
          value={`$${stats.netProfit.toFixed(2)}`}
          positive={stats.netProfit >= 0}
        />
        <StatCard title="Total Trades" value={stats.totalTrades.toString()} />
        <StatCard
          title="Win Rate"
          value={`${stats.winRate.toFixed(1)}%`}
          positive={stats.winRate >= 50}
        />
        <StatCard
          title="Best Trade"
          value={`$${stats.bestTrade.toFixed(2)}`}
          positive
        />
      </div>

      {/* Detailed Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Trading Statistics</h2>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reset Stats
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatItem label="Profitable Trades" value={stats.profitableTrades} />
          <StatItem label="Loss Trades" value={stats.lossTrades} />
          <StatItem
            label="Total Profit"
            value={`$${stats.totalProfit.toFixed(2)}`}
          />
          <StatItem
            label="Total Loss"
            value={`$${stats.totalLoss.toFixed(2)}`}
          />
          <StatItem
            label="Avg Profit"
            value={`$${stats.averageProfit.toFixed(2)}`}
          />
          <StatItem
            label="Avg Loss"
            value={`$${stats.averageLoss.toFixed(2)}`}
          />
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Recent Trades</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">Time</th>
                <th className="text-left py-2">Side</th>
                <th className="text-right py-2">Entry</th>
                <th className="text-right py-2">Exit</th>
                <th className="text-right py-2">Profit</th>
              </tr>
            </thead>
            <tbody>
              {stats.trades
                .slice(-10)
                .reverse()
                .map((trade, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-2">
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          trade.side === "LONG"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {trade.side}
                      </span>
                    </td>
                    <td className="text-right py-2">
                      ${trade.entryPrice.toFixed(5)}
                    </td>
                    <td className="text-right py-2">
                      ${trade.exitPrice.toFixed(5)}
                    </td>
                    <td
                      className={`text-right py-2 font-semibold ${
                        trade.profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ${trade.profit.toFixed(4)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  positive,
}: {
  title: string;
  value: string;
  positive?: boolean;
}) {
  const colorClass =
    positive === undefined
      ? "text-blue-600"
      : positive
      ? "text-green-600"
      : "text-red-600";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
