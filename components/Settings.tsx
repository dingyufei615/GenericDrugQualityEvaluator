
import React from 'react';

interface SettingsProps {
  model: string;
  setModel: (model: string) => void;
  customModel: string;
  setCustomModel: (model: string) => void;
  isLoading: boolean;
}

const Settings: React.FC<SettingsProps> = ({ model, setModel, customModel, setCustomModel, isLoading }) => {
  return (
    <section className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 mb-8">
      <h2 className="text-xl font-bold text-slate-800 mb-4">模型配置</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="model-select" className="block text-sm font-medium text-slate-700 mb-2">
            选择评估模型
          </label>
          <select
            id="model-select"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition bg-white"
          >
            <option value="gemini-2.5-flash">Gemini 2.5 Flash (速度快，性价比高)</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro (能力强，分析更深入)</option>
            <option value="custom">自定义模型名称...</option>
          </select>
          <p className="text-xs text-slate-500 mt-2">
            不同的模型会影响评估的速度、成本和分析深度。Pro 模型可能提供更详细的推理，但响应时间更长。
          </p>
        </div>

        {model === 'custom' && (
          <div className="animate-fade-in">
            <label htmlFor="custom-model-name" className="block text-sm font-medium text-slate-700 mb-2">
              自定义模型名称
            </label>
            <input
              type="text"
              id="custom-model-name"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="例如：gemini-2.5-pro-latest"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition"
              disabled={isLoading}
            />
             <p className="text-xs text-slate-500 mt-2">
              请输入您希望使用的完整模型名称。API Key 将从环境中自动获取，无需在此处配置。
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Settings;
