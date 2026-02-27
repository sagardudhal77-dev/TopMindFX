import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Server, Key, Lock, CheckCircle2 } from "lucide-react";

export function Settings() {
  const [connected, setConnected] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    setLoading(true);
    setTimeout(() => {
      setConnected(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-[var(--muted-foreground)]">Manage your MT5 connection and account preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-[var(--primary)]" />
            MetaTrader 5 Connection
          </CardTitle>
          <CardDescription>
            Connect your broker account to sync trade history and live data. Read-only access required.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connected ? (
            <div className="rounded-lg border border-[var(--success)]/30 bg-[var(--success)]/10 p-4 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[var(--success)] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-[var(--success)]">Connected Successfully</h4>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  Account: 10948572 (Demo) <br />
                  Broker: MetaQuotes-Demo <br />
                  Last synced: Just now
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Broker Server</label>
                <div className="relative">
                  <Server className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                  <input 
                    type="text" 
                    placeholder="e.g., MetaQuotes-Demo" 
                    className="w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-9 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Account Login</label>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                  <input 
                    type="text" 
                    placeholder="Account Number" 
                    className="w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-9 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Investor Password (Read-Only)</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full rounded-md border border-[var(--input)] bg-[var(--background)] px-9 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-[var(--border)] px-6 py-4">
          {connected ? (
            <Button variant="destructive" onClick={() => setConnected(false)}>
              Disconnect Account
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={loading} className="w-full sm:w-auto">
              {loading ? "Connecting..." : "Connect MT5 Account"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
