
import React from 'react';

const CheckIcon = () => (
  <svg className="w-5 h-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

interface ProgressFeedProps {
  feed: string[];
}

const ProgressFeed: React.FC<ProgressFeedProps> = ({ feed }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 animate-fade-in">
      <h2 className="text-xl font-bold text-center text-brand-blue-dark mb-6">评估进度</h2>
      <ul className="space-y-4">
        {feed.map((message, index) => {
          const parts = message.match(/^(\[.*?\])\s(.*)$/);
          let prefixContent;
          let mainContent = message;
          
          if (parts) {
            const prefix = parts[1];
            mainContent = parts[2];
            let prefixColor = 'text-slate-500';
            if (prefix.includes('搜索')) prefixColor = 'text-sky-600';
            if (prefix.includes('分析')) prefixColor = 'text-indigo-600';
            if (prefix.includes('验证')) prefixColor = 'text-amber-600';
            if (prefix.includes('生成')) prefixColor = 'text-emerald-600';
            if (prefix.includes('汇总')) prefixColor = 'text-rose-600';
            if (prefix.includes('来源')) prefixColor = 'text-slate-500';

            prefixContent = <strong className={`font-semibold ${prefixColor} mr-2`}>{prefix}</strong>;
          }

          return (
            <li key={index} className="flex items-start space-x-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms`, opacity: 0 }}>
              <div className="flex-shrink-0 pt-1">
                {index === feed.length - 1 && feed.length > 1 ? <SpinnerIcon /> : <CheckIcon />}
              </div>
              <p className="text-slate-700">
                {prefixContent}
                <span>{mainContent}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ProgressFeed;
