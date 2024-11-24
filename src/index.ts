import type OpenAI from 'openai'
import { PromptProcessor } from './PromptProcessor.js'
import { ToolExecutor } from './ToolExecutor.js'
import type { GoogleParams, PromptOptions } from './types.js'

export class GPTQuery {
  private readonly promptProcessor: PromptProcessor

  constructor({
    openai,
    googleParams,
    lightweightModel = 'gpt-4o-mini',
    finalModel = 'gpt-4o',
  }: {
    openai: OpenAI
    googleParams: GoogleParams
    vectorStorePath?: string
    embeddingModel?: string
    lightweightModel?: string
    finalModel?: string
  }) {
    const toolExecutor = new ToolExecutor(googleParams)

    this.promptProcessor = new PromptProcessor({
      openai,
      lightweightModel,
      finalModel,
      toolExecutor,
    })
  }

  /**
   * Processes a user prompt and returns the AI-generated response.
   * @param prompt - The user's input prompt.
   * @param context - Optional context or instructions to guide the response.
   * @param options - Configuration options for prompt processing.
   * @returns A Promise that resolves to the generated response string.
   */
  async processPrompt(
    prompt: string,
    context: string,
    options: PromptOptions,
  ): Promise<string> {
    try {
      return await this.promptProcessor.processPrompt(prompt, context, options)
    } catch (error) {
      console.error('Error processing prompt:', error)
      return 'An error occurred while processing your request.'
    }
  }
}

export default GPTQuery
