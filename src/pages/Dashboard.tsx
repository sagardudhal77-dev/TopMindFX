import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mt5Service, AccountMetrics, MonthlyPnL } from "@/services/mt5Service";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";
import { ArrowUpRight, ArrowDownRight, Activity, Percent, Clock, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dashboard() {
  const [metrics, setMetrics] = useState<AccountMetrics | null>(null);
  const [pnlData, setPnlData] = useState<MonthlyPnL[]>([]);

  useEffect(() => {
    mt5Service.getAccountMetrics().then(setMetrics);
    mt5Service.getMonthlyPnL().then(setPnlData);
  }, []);

  if (!metrics) {
    return <div className="flex h-full items-center justify-center text-[var(--muted-foreground)]">Loading metrics...</div>;
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-[var(--muted-foreground)]">Overview of your trading performance.</p>
      </div>

      {/* Top Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Equity" value={formatCurrency(metrics.equity)} icon={Activity} trend="+2.4%" isPositive={true} />
        <MetricCard title="Win Ratio" value={`${metrics.winRate}%`} icon={Percent} trend="+1.2%" isPositive={true} />
        <MetricCard title="Risk/Reward" value={`1:${metrics.riskRewardRatio}`} icon={Target} trend="Optimal" isPositive={true} />
        <MetricCard title="Max Drawdown" value={`${metrics.drawdown}%`} icon={ArrowDownRight} trend="Acceptable" isPositive={true} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pnlData.map((d, i) => ({ name: d.month, equity: 100000 + d.net * (i + 1) }))} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                    itemStyle={{ color: 'var(--primary)' }}
                  />
                  <Area type="monotone" dataKey="equity" stroke="var(--primary)" strokeWidth={2} fillOpacity={1} fill="url(#colorEquity)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Monthly PnL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pnlData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip 
                    cursor={{ fill: 'var(--accent)' }}
                    contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                  />
                  <Bar dataKey="net" radius={[4, 4, 0, 0]}>
                    {pnlData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.net >= 0 ? 'var(--success)' : 'var(--destructive)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Trades / Week</CardTitle>
            <Activity className="h-4 w-4 text-[var(--muted-foreground)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgTradesPerWeek}</div>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              {metrics.overtrading ? <span className="text-[var(--destructive)]">Warning: Overtrading detected</span> : "Optimal frequency"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Trade Duration</CardTitle>
            <Clock className="h-4 w-4 text-[var(--muted-foreground)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgTradeDurationHours}h</div>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Intraday holding pattern</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expectancy</CardTitle>
            <Target className="h-4 w-4 text-[var(--muted-foreground)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--success)]">{formatCurrency(metrics.expectancy)}</div>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Average profit per trade</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, isPositive }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">{title}</CardTitle>
        <Icon className="h-4 w-4 text-[var(--muted-foreground)]" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn("text-xs mt-1 flex items-center gap-1", isPositive ? "text-[var(--success)]" : "text-[var(--destructive)]")}>
          {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}
