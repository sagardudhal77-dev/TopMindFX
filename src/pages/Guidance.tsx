import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { mt5Service } from "@/services/mt5Service";
import { aiService, AIGuidance } from "@/services/aiService";
import { Target, XCircle, CheckCircle2, TrendingUp, BrainCircuit } from "lucide-react";

export function Guidance() {
  const [guidance, setGuidance] = useState<AIGuidance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const metrics = await mt5Service.getAccountMetrics();
        const result = await aiService.generateGuidance(metrics);
        setGuidance(result);
      } catch (error) {
        console.error("Failed to fetch guidance", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Pro Trading Guidance</h2>
          <p className="text-[var(--muted-foreground)]">Your personalized action plan from the AI Mentor.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm font-medium text-[var(--primary)]">
          <Target className="h-4 w-4" />
          Mentor Mode
        </div>
      </div>

      {loading || !guidance ? (
        <div className="flex h-64 flex-col items-center justify-center space-y-4 rounded-xl border border-[var(--border)] bg-[var(--card)]">
          <BrainCircuit className="h-8 w-8 animate-pulse text-[var(--primary)]" />
          <p className="text-sm text-[var(--muted-foreground)]">Generating personalized guidance plan...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {/* Action Plan Summary */}
          <Card className="md:col-span-3 border-[var(--primary)]/30 bg-[var(--primary)]/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--primary)]">
                <Target className="h-5 w-5" />
                Next Month's Action Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed">{guidance.actionPlan}</p>
            </CardContent>
          </Card>

          {/* Stop Doing */}
          <Card className="border-[var(--destructive)]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--destructive)]">
                <XCircle className="h-5 w-5" />
                Stop Doing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {guidance.stopDoing.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--destructive)] shrink-0" />
                    <span className="text-[var(--foreground)]/90">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Continue Doing */}
          <Card className="border-[var(--success)]/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--success)]">
                <CheckCircle2 className="h-5 w-5" />
                Continue Doing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {guidance.continueDoing.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--success)] shrink-0" />
                    <span className="text-[var(--foreground)]/90">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Improve */}
          <Card className="border-yellow-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-500">
                <TrendingUp className="h-5 w-5" />
                Focus on Improving
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {guidance.improve.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-500 shrink-0" />
                    <span className="text-[var(--foreground)]/90">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
