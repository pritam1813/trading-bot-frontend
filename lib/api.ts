import { BotConfig, BotStatus, TradingStats } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Bot controls
  async getBotStatus(): Promise<BotStatus> {
    return this.fetch<BotStatus>("/api/bot/status");
  }

  async startBot(): Promise<{ success: boolean; message: string }> {
    return this.fetch("/api/bot/start", { method: "POST" });
  }

  async stopBot(): Promise<{ success: boolean; message: string }> {
    return this.fetch("/api/bot/stop", { method: "POST" });
  }

  // Stats
  async getStats(): Promise<TradingStats> {
    return this.fetch<TradingStats>("/api/stats");
  }

  async resetStats(): Promise<{ success: boolean; message: string }> {
    return this.fetch("/api/stats/reset", { method: "POST" });
  }

  // Config
  async getConfig(): Promise<BotConfig> {
    return this.fetch<BotConfig>("/api/config");
  }

  async updateConfig(
    config: BotConfig
  ): Promise<{ success: boolean; message: string }> {
    return this.fetch("/api/config", {
      method: "PUT",
      body: JSON.stringify(config),
    });
  }
}

export const apiClient = new ApiClient();
