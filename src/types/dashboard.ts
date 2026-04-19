// Dashboard API Types

export interface DashboardSummary {
  totalAssessments: number;
  lowRiskCount: number;
  mediumRiskCount: number;
  highRiskCount: number;
  highRiskPercent: number;
  changeVsPreviousPeriodPercent: number;
}

export interface RiskDistributionItem {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  count: number;
  percent: number;
}

export interface RiskDistribution {
  total: number;
  distribution: RiskDistributionItem[];
}

export interface RecentAssessmentItem {
  assessmentId: string;
  assessmentNo: string;
  applicantName: string;
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export interface RecentAssessments {
  items: RecentAssessmentItem[];
}

export interface KeyInsight {
  type: 'POSITIVE' | 'WARNING' | 'ALERT';
  title: string;
  description: string;
}

export interface KeyInsights {
  insights: KeyInsight[];
}
