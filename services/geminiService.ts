import { GoogleGenAI } from "@google/genai";
import type { EvaluationResult, GroundingSource } from '../types.ts';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const cleanJsonString = (str: string): string => {
  // First, check for markdown fences and extract content if they exist.
  const markdownMatch = str.match(/```(json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch && markdownMatch[2]) {
    str = markdownMatch[2];
  }

  // Then, find the first '{' and the last '}' to extract the JSON object.
  // This is more robust against the model adding introductory text.
  const firstBrace = str.indexOf('{');
  const lastBrace = str.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    // If we can't find a valid JSON structure, return the original string
    // and let JSON.parse throw a more specific error.
    return str;
  }

  const jsonLikeString = str.substring(firstBrace, lastBrace + 1);
  return jsonLikeString.trim();
};

export const evaluateDrugQuality = async (drugName: string, manufacturer: string, model: string): Promise<EvaluationResult> => {
  const prompt = `
    请你扮演一位专业的药品供应链风险评估分析师。
    我需要你结合“炸弹项圈理论”与科学证据，来评估一款仿制药的质量。
    “炸弹项圈理论”的核心是：如果一家药企是其所在地的经济支柱（提供了大量税收和就业），那么它和地方政府都有极强的动机来确保药品质量，以避免经济动荡。

    评估任务：
    药品名称：${drugName}
    生产药企：${manufacturer}

    请遵循以下步骤进行分析，并使用 **谷歌搜索** 获取最新、最准确的信息：
    1.  **确定药企位置**: 找出“${manufacturer}”主要的生产基地或总部所在地。
    2.  **评估经济重要性**: 调查该药企为当地（市/省级别）贡献的利税、解决的就业人数。
    3.  **评估当地依赖度**: 分析这些经济贡献在当地经济总量中的占比和重要性。
    4.  **评估监管环境与历史**: 调查该企业所在地（国家及地区）历史上对产品质量问题的处理态度、监管严格程度以及该企业本身的历史质量记录。
    5.  **文献与监管审查**: 搜索与“${drugName}”（由“${manufacturer}”生产）相关的科学文献、生物等效性研究报告以及主要监管机构（如中国NMPA、美国FDA）的审查意见或警告。
    6.  **综合评分**: 基于以上所有分析，给出一个综合评分。

    输出要求：
    请严格按照下面的JSON格式返回你的分析结果。你的输出必须是一个可以直接被 Javascript 的 JSON.parse() 函数解析的纯净 JSON 对象，开头是 "{"，结尾是 "}"。不要添加任何markdown代码块、解释或说明。分数范围均为0-100。

    {
      "overallScore": <number>,
      "summary": "<string: 对评估结果的简要总结>",
      "scores": {
        "economicImportance": {
          "score": <number>,
          "reasoning": "<string: 对“经济重要性”评分的详细说明>"
        },
        "localDependency": {
          "score": <number>,
          "reasoning": "<string: 对“当地依赖度”评分的详细说明>"
        },
        "regulatoryEnvironment": {
          "score": <number>,
          "reasoning": "<string: 对“监管环境”评分的详细说明>"
        },
        "qualityHistory": {
          "score": <number>,
          "reasoning": "<string: 对“企业质量历史”评分的详细说明>"
        },
        "scientificEvidence": {
            "score": <number>,
            "reasoning": "<string: 对“科学文献与监管意见”的总结和评分说明>"
        }
      }
    }
    `;
    
  let response;
  try {
    response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: "You are a data analysis API. Your sole function is to return a valid JSON object based on the user's request. Do not include any introductory text, explanations, or markdown formatting. The entire response must be a single, parsable JSON object.",
        tools: [{ googleSearch: {} }],
        // Setting temperature to 0 to encourage more deterministic, structured output
        temperature: 0,
      },
    });

    const jsonString = cleanJsonString(response.text);
    const parsedResult = JSON.parse(jsonString) as Omit<EvaluationResult, 'sources'>;

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .map((chunk: any) => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || '未知来源'
      }))
      .filter(source => source.uri);

    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

    return { ...parsedResult, sources: uniqueSources };
  } catch (error) {
    console.error("Error evaluating drug quality:", error);
    if (error instanceof SyntaxError) {
        const rawText = response?.text || "No response text available.";
        console.error("Malformed JSON string received from model:", rawText);
        // The error from JSON.parse is a SyntaxError
        throw new Error("模型返回了无效的JSON格式，无法解析评估结果。");
    }
    // For other types of errors (e.g., network, API key)
    throw new Error("与 Gemini API 通信时发生错误。");
  }
};