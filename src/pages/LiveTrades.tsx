import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mt5Service, Trade } from "@/services/mt5Service";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function LiveTrades() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    // Initial fetch
    mt5Service.getTrades().then(allTrades => {
      setTrades(allTrades.filter(t => t.status === "OPEN"));
    });

    // Subscribe to live updates
    const unsubscribe = mt5Service.subscribeToLiveTrades((liveTrades) => {
      setTrades(liveTrades);
    });

    return () => unsubscribe();
  }, []);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Live Active Trades</h2>
          <p className="text-[var(--muted-foreground)]">Real-time monitoring of open positions.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm font-medium text-[var(--primary)]">
          <Activity className="h-4 w-4 animate-pulse" />
          Live Connection
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Open Positions ({trades.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[var(--muted-foreground)] uppercase bg-[var(--accent)]/50">
                <tr>
                  <th className="px-6 py-3 rounded-tl-lg">Symbol</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Lot Size</th>
                  <th className="px-6 py-3">Entry Price</th>
                  <th className="px-6 py-3">Current Price</th>
                  <th className="px-6 py-3">Open Time</th>
                  <th className="px-6 py-3 text-right rounded-tr-lg">Floating PnL</th>
                </tr>
              </thead>
              <tbody>
                {trades.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-[var(--muted-foreground)]">
                      No active trades at the moment.
                    </td>
                  </tr>
                ) : (
                  trades.map((trade) => (
                    <tr key={trade.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--accent)]/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{trade.symbol}</td>
                      <td className="px-6 py-4">
                        <Badge variant={trade.type === "BUY" ? "success" : "destructive"} className="bg-opacity-20">
                          {trade.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-mono">{trade.lotSize.toFixed(2)}</td>
                      <td className="px-6 py-4 font-mono">{trade.entryPrice.toFixed(5)}</td>
                      <td className="px-6 py-4 font-mono">{trade.currentPrice.toFixed(5)}</td>
                      <td className="px-6 py-4 text-[var(--muted-foreground)]">
                        {format(new Date(trade.openTime), "MMM dd, HH:mm")}
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-medium">
                        <div className={cn(
                          "flex items-center justify-end gap-1",
                          trade.pnl >= 0 ? "text-[var(--success)]" : "text-[var(--destructive)]"
                        )}>
                          {trade.pnl >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                          {formatCurrency(trade.pnl)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
