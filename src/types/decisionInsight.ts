export type DecisionInsight = {
  id: string;
  title: string;
  prediction: string;
  insight: string;
  recommendedAction: string;
  expectedImpact: string;
  confidence?: number;
  reason?: string;
  tone?: "info" | "success" | "warning";
};
