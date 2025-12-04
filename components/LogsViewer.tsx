"use client";

import { useEffect, useState } from "react";
import { wsClient } from "@/lib/websocket";
import { LogEntry } from "@/types";

export default function LogsViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    wsClient.connect();

    wsClient.on("log", (data: LogEntry) => {
      setLogs((prev) => [...prev.slice(-200), data]); // Keep last 200 logs
      if (autoScroll) {
        setTimeout(() => {
          const element = document.getElementById("logs-end");
          element?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    });

    return () => {
      wsClient.off("log", () => {});
    };
  }, [autoScroll]);

  const filteredLogs = logs.filter(
    (log) => filter === "all" || log.level === filter
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-600";
      case "warn":
        return "text-yellow-600";
      case "info":
        return "text-blue-600";
      case "debug":
        return "text-gray-600";
      default:
        return "text-gray-800";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Live Logs</h2>
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Auto-scroll</span>
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1 border rounded-lg"
          >
            <option value="all">All Levels</option>
            <option value="error">Errors</option>
            <option value="warn">Warnings</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
          <button
            onClick={() => setLogs([])}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="bg-black text-green-400 p-4 rounded-lg h-[600px] overflow-y-auto font-mono text-sm">
        {filteredLogs.length === 0 ? (
          <p className="text-gray-500">No logs yet...</p>
        ) : (
          filteredLogs.map((log, i) => (
            <div key={i} className="mb-1">
              <span className="text-gray-500">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>{" "}
              <span className={getLevelColor(log.level)}>
                [{log.level.toUpperCase()}]
              </span>{" "}
              <span>{log.message}</span>
            </div>
          ))
        )}
        <div id="logs-end" />
      </div>
    </div>
  );
}
