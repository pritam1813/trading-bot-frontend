export interface BotStatus {
  state: "idle" | "running" | "stopping" | "error";
  isRunning: boolean;
  uptime: number;
  consecutiveLosses: number;
}

export interface TradingStats {
  totalTrades: number;
  profitableTrades: number;
  lossTrades: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  totalVolume?: number;
  winRate: number;
  averageProfit: number;
  averageLoss: number;
  bestTrade: number;
  worstTrade: number;
  trades: Trade[];
}

export interface Trade {
  timestamp: string;
  side: "LONG" | "SHORT";
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  profit: number;
  fees: number;
  isProfit: boolean;
}

export interface BotConfig {
  trading: {
    symbol: string;
    baseUrl: string;
    wsBaseUrl: string;
    orderQuantity: number;
    leverage: number;
    marginType: "ISOLATED" | "CROSSED";
  };
  strategy: {
    profitMultiplier: number;
    riskRewardRatio: number;
    maxConsecutiveLosses: number;
    checkIntervalMs: number;
    minOrderBookImbalance: number;
    minLiquidity: number;
    directionPreference: "LONG" | "SHORT" | "BOTH";
  };
  risk: {
    maxDailyLossUSDT: number;
    maxPositions: number;
    maxRiskPerTrade: number;
  };
  fees: {
    makerFeeRate: number;
    takerFeeRate: number;
  };
  logging: {
    level: string;
    logFilePath: string;
    statsFilePath: string;
  };
}

export interface LogEntry {
  level: "info" | "warn" | "error" | "debug";
  message: string;
  timestamp: string;
  [key: string]: any;
}
