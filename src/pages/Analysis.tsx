import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { mt5Service, AccountMetrics, Trade } from "@/services/mt5Service";
import { aiService, AIAnalysisIssue } from "@/services/aiService";
import { BrainCircuit, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Analysis() {
  const [issues, setIssues] = useState<AIAnalysisIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metrics = await mt5Service.getAccountMetrics();
        const trades = await mt5Service.getTrades();
        const analysis = await aiService.analyzeTradingBehavior(metrics, trades);
        setIssues(analysis);
      } catch (error) {
        console.error("Failed to fetch analysis", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "bg-[var(--destructive)]/20 text-[var(--destructive)] border-[var(--destructive)]/30";
      case "medium": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
      case "low": return "bg-[var(--primary)]/20 text-[var(--primary)] border-[var(--primary)]/30";
      default: return "bg-[var(--accent)] text-[var(--foreground)]";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return <AlertTriangle className="h-5 w-5 text-[var(--destructive)]" />;
      case "medium": return <Info className="h-5 w-5 text-yellow-500" />;
      case "low": return <CheckCircle2 className="h-5 w-5 text-[var(--primary)]" />;
      default: return <Info className="h-5 w-5 text-[var(--muted-foreground)]" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Behavior Analysis</h2>
          <p className="text-[var(--muted-foreground)]">Deep dive into your trading patterns and mistakes.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm font-medium text-[var(--primary)]">
          <BrainCircuit className="h-4 w-4" />
          Powered by Gemini
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <BrainCircuit className="h-8 w-8 animate-pulse text-[var(--primary)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Analyzing trading history...</p>
        </div>
      ) : issues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle2 className="h-12 w-12 text-[var(--success)] mb-4" />
            <h3 className="text-lg font-semibold">No critical issues found</h3>
            <p className="text-[var(--muted-foreground)] text-center max-w-md mt-2">
              Your recent trading behavior looks solid. Keep following your plan and maintaining discipline.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {issues.map((issue, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{issue.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={cn("border", getSeverityColor(issue.severity))}>
                      {issue.severity} Severity
                    </Badge>
                  </div>
                </div>
                {getSeverityIcon(issue.severity)}
              </CardHeader>
              <CardContent className="flex-1 pt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--muted-foreground)] mb-1">Evidence</h4>
                    <p className="text-sm font-mono bg-[var(--accent)]/50 p-2 rounded-md border border-[var(--border)]">
                      {issue.evidence}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--muted-foreground)] mb-1">Analysis & Fix</h4>
                    <p className="text-sm leading-relaxed text-[var(--foreground)]/90">
                      {issue.explanation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
