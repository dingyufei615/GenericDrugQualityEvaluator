
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-12 py-4">
      <div className="container mx-auto px-4 text-center text-sm text-slate-500">
        <p>由 Gemini API 强力驱动 | 评估结果仅供参考，不构成任何医疗建议。</p>
        <p>&copy; {new Date().getFullYear()} 仿制药质量评估器</p>
      </div>
    </footer>
  );
};

export default Footer;
