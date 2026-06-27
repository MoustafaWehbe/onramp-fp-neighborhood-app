"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAIClient = getAIClient;
exports.chatCompletion = chatCompletion;
const openai_1 = __importDefault(require("openai"));
let openaiClient = null;
function getAIClient() {
    if (!openaiClient) {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error("OPENAI_API_KEY is not configured");
        }
        openaiClient = new openai_1.default({ apiKey });
    }
    return openaiClient;
}
async function chatCompletion(messages, options) {
    const client = getAIClient();
    const response = await client.chat.completions.create({
        model: options?.model ?? "gpt-4o-mini",
        messages,
        ...options,
    });
    return response.choices[0]?.message?.content ?? "";
}
//# sourceMappingURL=client.js.map