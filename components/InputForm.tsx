
import React from 'react';

interface InputFormProps {
  drugName: string;
  setDrugName: (value: string) => void;
  manufacturer: string;
  setManufacturer: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ drugName, setDrugName, manufacturer, setManufacturer, handleSubmit, isLoading }) => {
  return (
    <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="drugName" className="block text-sm font-medium text-slate-700 mb-2">
              药品通用名
            </label>
            <input
              type="text"
              id="drugName"
              value={drugName}
              onChange={(e) => setDrugName(e.target.value)}
              placeholder="例如：布洛芬缓释胶囊"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="manufacturer" className="block text-sm font-medium text-slate-700 mb-2">
              生产药企
            </label>
            <input
              type="text"
              id="manufacturer"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
              placeholder="例如：中美史克"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? '评估中...' : '开始评估'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default InputForm;
