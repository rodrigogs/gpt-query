import type OpenAI from 'openai';
import type { GoogleParams, PromptOptions } from './types.js';
export declare class GPTQuery {
    private readonly promptProcessor;
    constructor({ openai, googleParams, lightweightModel, finalModel, }: {
        openai: OpenAI;
        googleParams: GoogleParams;
        vectorStorePath?: string;
        embeddingModel?: string;
        lightweightModel?: string;
        finalModel?: string;
    });
    /**
     * Processes a user prompt and returns the AI-generated response.
     * @param prompt - The user's input prompt.
     * @param context - Optional context or instructions to guide the response.
     * @param options - Configuration options for prompt processing.
     * @returns A Promise that resolves to the generated response string.
     */
    processPrompt(prompt: string, context: string, options: PromptOptions): Promise<string>;
}
export default GPTQuery;
