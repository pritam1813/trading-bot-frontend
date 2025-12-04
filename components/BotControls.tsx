"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { BotStatus } from "@/types";

export default function BotControls() {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const data = await apiClient.getBotStatus();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch bot status");
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    setLoading(true);
    try {
      await apiClient.startBot();
      await fetchStatus();
    } catch (err) {
      setError("Failed to start bot");
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await apiClient.stopBot();
      await fetchStatus();
    } catch (err) {
      setError("Failed to stop bot");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!status) return "bg-gray-500";
    switch (status.state) {
      case "running":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      case "stopping":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    if (!status) return "Unknown";
    return status.state.charAt(0).toUpperCase() + status.state.slice(1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Bot Controls</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}
          ></div>
          <span className="font-semibold">{getStatusText()}</span>
        </div>
        {status && status.uptime > 0 && (
          <span className="text-sm text-gray-600">
            Uptime: {Math.floor(status.uptime / 1000 / 60)}m
          </span>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleStart}
          disabled={loading || status?.isRunning}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Loading..." : "Start Bot"}
        </button>
        <button
          onClick={handleStop}
          disabled={loading || !status?.isRunning}
          className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Loading..." : "Stop Bot"}
        </button>
      </div>

      {status && status.consecutiveLosses > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            ⚠️ Consecutive losses: {status.consecutiveLosses}
          </p>
        </div>
      )}
    </div>
  );
}
