
import React from 'react';
import type { EvaluationResult } from '../types';
import ScoreCard from './ScoreCard';

interface ResultsDisplayProps {
  result: EvaluationResult;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result }) => {
  const { overallScore, summary, scores, sources } = result;

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-brand-blue-dark mb-6">评估报告</h2>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-40 h-40">
           <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    className="text-slate-200"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                />
                <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    className={getScoreColor(overallScore)}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${overallScore}, 100`}
                />
            </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</span>
            <span className="text-sm font-semibold text-slate-600">综合评分</span>
          </div>
        </div>
        <p className="text-center mt-4 text-slate-700 max-w-2xl">{summary}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <ScoreCard title="经济重要性" score={scores.economicImportance.score} reasoning={scores.economicImportance.reasoning} />
        <ScoreCard title="当地依赖度" score={scores.localDependency.score} reasoning={scores.localDependency.reasoning} />
        <ScoreCard title="监管环境" score={scores.regulatoryEnvironment.score} reasoning={scores.regulatoryEnvironment.reasoning} />
        <ScoreCard title="企业质量历史" score={scores.qualityHistory.score} reasoning={scores.qualityHistory.reasoning} />
        <div className="md:col-span-2">
            <ScoreCard title="科学文献与监管意见" score={scores.scientificEvidence.score} reasoning={scores.scientificEvidence.reasoning} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-3 border-b pb-2">参考来源</h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          {sources.length > 0 ? sources.map((source, index) => (
            <li key={index}>
              <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline hover:text-brand-blue-dark">
                {source.title}
              </a>
            </li>
          )) : (
             <li>未找到明确的公开信息来源。</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ResultsDisplay;