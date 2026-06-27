import OpenAI from "openai";
export declare function getAIClient(): OpenAI;
export declare function chatCompletion(messages: OpenAI.Chat.ChatCompletionMessageParam[], options?: Partial<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>): Promise<string>;
