
export interface ScoreComponent {
  score: number;
  reasoning: string;
}

export interface GroundingSource {
  uri: string;
  title: string;
}

export interface EvaluationResult {
  overallScore: number;
  summary: string;
  scores: {
    economicImportance: ScoreComponent;
    localDependency: ScoreComponent;
    regulatoryEnvironment: ScoreComponent;
    qualityHistory: ScoreComponent;
  };
  sources: GroundingSource[];
}
