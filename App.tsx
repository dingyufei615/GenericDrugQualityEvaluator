
import React, { useState, useCallback } from 'react';
import type { EvaluationResult } from './types';
import { evaluateDrugQuality } from './services/geminiService';
import Settings from './components/Settings';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import ProgressFeed from './components/ProgressFeed';
import ErrorDisplay from './components/ErrorDisplay';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [model, setModel] = useState<string>('gemini-2.5-flash');
  const [customModel, setCustomModel] = useState<string>(''); // New state for custom model name
  const [drugName, setDrugName] = useState<string>('');
  const [manufacturer, setManufacturer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [progressFeed, setProgressFeed] = useState<string[]>([]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!drugName || !manufacturer) {
      setError('请输入药品名称和生产药企。');
      return;
    }
    
    const modelToUse = model === 'custom' ? customModel.trim() : model;
    if (!modelToUse) {
        setError('请选择或输入一个有效的模型名称。');
        return;
    }

    setIsLoading(true);
    setResult(null);
    setProgressFeed([]);

    try {
        const modelName = model === 'custom' ? modelToUse : (model === 'gemini-2.5-pro' ? 'Gemini 2.5 Pro' : 'Gemini 2.5 Flash');
        const feedMessages = [
            "评估请求已提交...",
            `正在初始化 ${modelName} 模型...`,
            `[搜索] 正在查询 "${manufacturer}" 的企业背景及主要生产基地...`,
            `[分析] 正在评估 "${manufacturer}" 对当地经济的贡献（税收、就业）...`,
            `[搜索] 正在检索关于 "${manufacturer}" 所在地的监管政策...`,
            `[分析] 正在评估当地政府对企业的依赖程度...`,
            `[搜索] 正在查找 "${manufacturer}" 过往的产品质量安全记录...`,
            `[搜索] 正在检索相关的临床研究文献与监管机构(NMPA, FDA)意见...`,
            `[分析] 正在分析文献中的疗效、安全性数据及监管结论...`,
            `[验证] 正在进行多源信息交叉验证，确保数据准确性...`,
            `[生成] 数据分析完成，正在生成最终评估报告...`
        ];

        // Start the API call in the background
        const apiCallPromise = evaluateDrugQuality(drugName, manufacturer, modelToUse);

        // Animate the feed messages while the API call is in flight
        for (const message of feedMessages) {
            setProgressFeed(prev => [...prev, message]);
            await sleep(900);
        }

        // Wait for the API call to finish
        const evaluation = await apiCallPromise;
        
        // Display the sources found
        setProgressFeed(prev => [...prev, '[汇总] 已确认以下主要信息来源:']);
        await sleep(500);

        if (evaluation.sources.length > 0) {
            for (const source of evaluation.sources) {
                setProgressFeed(prev => [...prev, `[来源] ${source.title}`]);
                await sleep(250);
            }
        } else {
            setProgressFeed(prev => [...prev, '[来源] 未找到明确的公开信息来源。']);
            await sleep(250);
        }
        
        await sleep(1800); // Give user time to read sources

        setResult(evaluation);

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(`评估失败：${err.message}`);
      } else {
        setError('发生未知错误，请稍后重试。');
      }
    } finally {
      setIsLoading(false);
    }
  }, [drugName, manufacturer, model, customModel]); // Add customModel to dependency array

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-brand-gray-dark flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <Settings 
            model={model} 
            setModel={setModel} 
            customModel={customModel}
            setCustomModel={setCustomModel}
            isLoading={isLoading} 
          />
          <InputForm
            drugName={drugName}
            setDrugName={setDrugName}
            manufacturer={manufacturer}
            setManufacturer={setManufacturer}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
          <div className="mt-8">
            {isLoading && <ProgressFeed feed={progressFeed} />}
            {error && !isLoading && <ErrorDisplay message={error} />}
            {result && !isLoading && <ResultsDisplay result={result} />}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;