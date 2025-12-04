"use client";

import React, { useEffect, useState } from "react";
import { BotConfig } from "@/types";
import { apiClient } from "@/lib/api";

export default function ConfigPage() {
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const data = await apiClient.getConfig();
      setConfig(data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load configuration" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;

    setSaving(true);
    try {
      await apiClient.updateConfig(config);
      setMessage({
        type: "success",
        text: "Configuration saved successfully!",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save configuration" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (path: string, value: any) => {
    if (!config) return;

    const keys = path.split(".");
    const newConfig = { ...config };
    let current: any = newConfig;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
  };

  if (loading) {
    return <div className="text-center py-8">Loading configuration...</div>;
  }

  if (!config) {
    return <div className="text-center py-8">Failed to load configuration</div>;
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Bot Configuration</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 px-4 py-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Trading Config */}
        <Section title="Trading">
          <Input
            label="Symbol"
            value={config.trading.symbol}
            onChange={(v) => handleChange("trading.symbol", v)}
          />
          <Input
            label="Order Quantity"
            type="number"
            value={config.trading.orderQuantity}
            onChange={(v) => handleChange("trading.orderQuantity", Number(v))}
          />
          <Input
            label="Leverage"
            type="number"
            value={config.trading.leverage}
            onChange={(v) => handleChange("trading.leverage", Number(v))}
          />
          <Select
            label="Margin Type"
            value={config.trading.marginType}
            options={["ISOLATED", "CROSSED"]}
            onChange={(v) => handleChange("trading.marginType", v)}
          />
        </Section>

        {/* Strategy Config */}
        <Section title="Strategy">
          <Input
            label="Profit Multiplier"
            type="number"
            step="0.1"
            value={config.strategy.profitMultiplier}
            onChange={(v) =>
              handleChange("strategy.profitMultiplier", Number(v))
            }
          />
          <Input
            label="Risk/Reward Ratio"
            type="number"
            step="0.1"
            value={config.strategy.riskRewardRatio}
            onChange={(v) =>
              handleChange("strategy.riskRewardRatio", Number(v))
            }
          />
          <Input
            label="Max Consecutive Losses"
            type="number"
            value={config.strategy.maxConsecutiveLosses}
            onChange={(v) =>
              handleChange("strategy.maxConsecutiveLosses", Number(v))
            }
          />
          <Input
            label="Check Interval (ms)"
            type="number"
            value={config.strategy.checkIntervalMs}
            onChange={(v) =>
              handleChange("strategy.checkIntervalMs", Number(v))
            }
          />
          <Select
            label="Direction Preference"
            value={config.strategy.directionPreference}
            options={["LONG", "SHORT", "BOTH"]}
            onChange={(v) => handleChange("strategy.directionPreference", v)}
          />
        </Section>

        {/* Risk Config */}
        <Section title="Risk Management">
          <Input
            label="Max Daily Loss (USDT)"
            type="number"
            value={config.risk.maxDailyLossUSDT}
            onChange={(v) => handleChange("risk.maxDailyLossUSDT", Number(v))}
          />
          <Input
            label="Max Positions"
            type="number"
            value={config.risk.maxPositions}
            onChange={(v) => handleChange("risk.maxPositions", Number(v))}
          />
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b pb-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", step }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Select({ label, value, options, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt: string) => {
          <option key={opt} value={opt}></option>;
        })}
      </select>
    </div>
  );
}
