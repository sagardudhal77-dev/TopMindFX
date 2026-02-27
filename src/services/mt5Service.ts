export interface Trade {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  lotSize: number;
  entryPrice: number;
  currentPrice: number;
  openTime: string;
  closeTime?: string;
  pnl: number;
  status: "OPEN" | "CLOSED";
}

export interface AccountMetrics {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  drawdown: number;
  winRate: number;
  riskRewardRatio: number;
  avgTradesPerWeek: number;
  avgTradeDurationHours: number;
  expectancy: number;
  overtrading: boolean;
}

export interface MonthlyPnL {
  month: string;
  profit: number;
  loss: number;
  net: number;
}

// Mock Data Generator
const generateMockTrades = (): Trade[] => {
  const trades: Trade[] = [];
  const symbols = ["EURUSD", "GBPUSD", "XAUUSD", "US30", "BTCUSD"];
  
  // Generate some closed trades
  for (let i = 0; i < 50; i++) {
    const isWin = Math.random() > 0.4; // 60% win rate
    const pnl = isWin ? Math.random() * 500 + 50 : -(Math.random() * 300 + 50);
    
    trades.push({
      id: `TRD-${1000 + i}`,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      type: Math.random() > 0.5 ? "BUY" : "SELL",
      lotSize: Number((Math.random() * 2 + 0.1).toFixed(2)),
      entryPrice: 1.0 + Math.random() * 1000,
      currentPrice: 1.0 + Math.random() * 1000,
      openTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      closeTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
      pnl: Number(pnl.toFixed(2)),
      status: "CLOSED",
    });
  }

  // Generate some open trades
  for (let i = 0; i < 5; i++) {
    const pnl = (Math.random() - 0.5) * 400;
    trades.push({
      id: `TRD-OPEN-${i}`,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      type: Math.random() > 0.5 ? "BUY" : "SELL",
      lotSize: Number((Math.random() * 2 + 0.1).toFixed(2)),
      entryPrice: 1.0 + Math.random() * 1000,
      currentPrice: 1.0 + Math.random() * 1000,
      openTime: new Date(Date.now() - Math.random() * 2 * 24 * 60 * 60 * 1000).toISOString(),
      pnl: Number(pnl.toFixed(2)),
      status: "OPEN",
    });
  }

  return trades.sort((a, b) => new Date(b.openTime).getTime() - new Date(a.openTime).getTime());
};

const mockTrades = generateMockTrades();

export const mt5Service = {
  getAccountMetrics: async (): Promise<AccountMetrics> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      balance: 105420.50,
      equity: 106120.25,
      margin: 2500.00,
      freeMargin: 103620.25,
      marginLevel: 4244.81,
      drawdown: 4.2,
      winRate: 62.5,
      riskRewardRatio: 1.8,
      avgTradesPerWeek: 12,
      avgTradeDurationHours: 4.5,
      expectancy: 125.50,
      overtrading: false,
    };
  },

  getTrades: async (): Promise<Trade[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockTrades;
  },

  getMonthlyPnL: async (): Promise<MonthlyPnL[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [
      { month: "Jan", profit: 4500, loss: 2100, net: 2400 },
      { month: "Feb", profit: 3200, loss: 3800, net: -600 },
      { month: "Mar", profit: 5100, loss: 1500, net: 3600 },
      { month: "Apr", profit: 6200, loss: 2200, net: 4000 },
      { month: "May", profit: 4800, loss: 1900, net: 2900 },
      { month: "Jun", profit: 7500, loss: 3100, net: 4400 },
    ];
  },
  
  // Simulate live price updates for open trades
  subscribeToLiveTrades: (callback: (trades: Trade[]) => void) => {
    const interval = setInterval(() => {
      const updatedTrades = mockTrades.map(t => {
        if (t.status === "OPEN") {
          // Randomly fluctuate PnL
          const fluctuation = (Math.random() - 0.5) * 50;
          return { ...t, pnl: Number((t.pnl + fluctuation).toFixed(2)) };
        }
        return t;
      });
      callback(updatedTrades.filter(t => t.status === "OPEN"));
    }, 2000);
    
    return () => clearInterval(interval);
  }
};
