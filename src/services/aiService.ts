import { GoogleGenAI, Type } from "@google/genai";
import { AccountMetrics, Trade } from "./mt5Service";

// Initialize Gemini API
// The API key is automatically injected into process.env.GEMINI_API_KEY by the platform
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AIAnalysisIssue {
  title: string;
  severity: "Low" | "Medium" | "High";
  evidence: string;
  explanation: string;
}

export interface AIGuidance {
  stopDoing: string[];
  continueDoing: string[];
  improve: string[];
  actionPlan: string;
}

export const aiService = {
  analyzeTradingBehavior: async (metrics: AccountMetrics, recentTrades: Trade[]): Promise<AIAnalysisIssue[]> => {
    try {
      const prompt = `
        Analyze the following trading data and identify common trading mistakes, emotional patterns, risk mismanagement, or poor timing.
        
        Account Metrics:
        Win Rate: ${metrics.winRate}%
        Risk/Reward: ${metrics.riskRewardRatio}
        Drawdown: ${metrics.drawdown}%
        Avg Trades/Week: ${metrics.avgTradesPerWeek}
        
        Recent Trades Summary:
        ${recentTrades.slice(0, 10).map(t => `${t.symbol} ${t.type} Lot:${t.lotSize} PnL:$${t.pnl}`).join('\n')}
        
        Provide a professional, mentor-style analysis.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are a senior institutional trading mentor. Analyze the data and provide actionable, direct feedback without fluff.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Short title of the issue (e.g., 'Inconsistent Lot Sizing')" },
                severity: { type: Type.STRING, description: "Low, Medium, or High" },
                evidence: { type: Type.STRING, description: "Data point proving the issue" },
                explanation: { type: Type.STRING, description: "Clear explanation of why this is bad and how to fix it" }
              },
              required: ["title", "severity", "evidence", "explanation"]
            }
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
      return [];
    } catch (error) {
      console.error("Error analyzing trading behavior:", error);
      return [];
    }
  },

  generateGuidance: async (metrics: AccountMetrics): Promise<AIGuidance> => {
    try {
      const prompt = `
        Based on the trader's metrics, provide a personalized improvement plan.
        
        Metrics:
        Win Rate: ${metrics.winRate}%
        Risk/Reward: ${metrics.riskRewardRatio}
        Drawdown: ${metrics.drawdown}%
        Expectancy: $${metrics.expectancy}
        Overtrading: ${metrics.overtrading ? 'Yes' : 'No'}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          systemInstruction: "You are a senior institutional trading mentor. Provide a direct, professional action plan.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              stopDoing: { type: Type.ARRAY, items: { type: Type.STRING } },
              continueDoing: { type: Type.ARRAY, items: { type: Type.STRING } },
              improve: { type: Type.ARRAY, items: { type: Type.STRING } },
              actionPlan: { type: Type.STRING, description: "A clear paragraph summarizing the next month's action plan" }
            },
            required: ["stopDoing", "continueDoing", "improve", "actionPlan"]
          }
        }
      });

      if (response.text) {
        return JSON.parse(response.text);
      }
      throw new Error("Empty response");
    } catch (error) {
      console.error("Error generating guidance:", error);
      return {
        stopDoing: ["Awaiting data..."],
        continueDoing: ["Awaiting data..."],
        improve: ["Awaiting data..."],
        actionPlan: "Unable to generate guidance at this time."
      };
    }
  }
};
