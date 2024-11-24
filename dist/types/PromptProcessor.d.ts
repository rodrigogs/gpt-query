import type OpenAI from 'openai';
import type { ToolExecutor } from './ToolExecutor.js';
import type { PromptOptions } from './types.js';
export declare class PromptProcessor {
    private readonly openai;
    private readonly lightweightModel;
    private readonly finalModel;
    private readonly toolExecutor;
    constructor({ openai, lightweightModel, finalModel, toolExecutor, }: {
        openai: OpenAI;
        lightweightModel: string;
        finalModel: string;
        toolExecutor: ToolExecutor;
    });
    /**
     * Determines if a search is needed and detects the user's language.
     */
    private decideSearchAndDetectLanguage;
    /**
     * Processes the user prompt and generates a response.
     */
    processPrompt(prompt: string, userContext: string, options?: PromptOptions): Promise<string>;
}
