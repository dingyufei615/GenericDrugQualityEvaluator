
import React from 'react';

interface ScoreCardProps {
  title: string;
  score: number;
  reasoning: string;
}

const getBarColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

const ScoreCard: React.FC<ScoreCardProps> = ({ title, score, reasoning }) => {
  return (
    <div className="bg-slate-50 p-5 rounded-lg border border-slate-200 h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-slate-800">{title}</h4>
        <span className={`font-bold text-lg ${getBarColor(score).replace('bg-', 'text-')}`}>{score}</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
        <div className={`${getBarColor(score)} h-2.5 rounded-full`} style={{ width: `${score}%` }}></div>
      </div>
      <p className="text-slate-600 text-sm flex-grow">{reasoning}</p>
    </div>
  );
};

export default ScoreCard;
