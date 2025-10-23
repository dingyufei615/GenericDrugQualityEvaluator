
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-5 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-blue-dark">
          仿制药质量评估器
        </h1>
        <p className="text-md text-brand-gray mt-2">
          基于“炸弹项圈理论”的智能分析工具
        </p>
      </div>
    </header>
  );
};

export default Header;
