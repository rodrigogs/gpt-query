"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GPTQuery = void 0;
const PromptProcessor_js_1 = require("./PromptProcessor.js");
const ToolExecutor_js_1 = require("./ToolExecutor.js");
class GPTQuery {
    constructor({ openai, googleParams, lightweightModel = 'gpt-4o-mini', finalModel = 'gpt-4o', }) {
        const toolExecutor = new ToolExecutor_js_1.ToolExecutor(googleParams);
        this.promptProcessor = new PromptProcessor_js_1.PromptProcessor({
            openai,
            lightweightModel,
            finalModel,
            toolExecutor,
        });
    }
    /**
     * Processes a user prompt and returns the AI-generated response.
     * @param prompt - The user's input prompt.
     * @param context - Optional context or instructions to guide the response.
     * @param options - Configuration options for prompt processing.
     * @returns A Promise that resolves to the generated response string.
     */
    processPrompt(prompt, context, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.promptProcessor.processPrompt(prompt, context, options);
            }
            catch (error) {
                console.error('Error processing prompt:', error);
                return 'An error occurred while processing your request.';
            }
        });
    }
}
exports.GPTQuery = GPTQuery;
exports.default = GPTQuery;
