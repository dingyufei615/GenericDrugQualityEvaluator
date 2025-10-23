
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg border border-slate-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
        <p className="mt-4 text-slate-600 font-semibold">正在调用 Gemini 模型并搜索网络信息...</p>
        <p className="mt-1 text-sm text-slate-500">此过程可能需要一些时间，请耐心等待。</p>
    </div>
  );
};

export default LoadingSpinner;
