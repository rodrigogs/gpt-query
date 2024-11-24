import type OpenAI from 'openai'
import type { ToolExecutor } from './ToolExecutor.js'
import type {
  PartialChatCompletionCreateParams,
  PromptOptions,
} from './types.js'

export class PromptProcessor {
  private readonly openai: OpenAI
  private readonly lightweightModel: string
  private readonly finalModel: string
  private readonly toolExecutor: ToolExecutor

  constructor({
    openai,
    lightweightModel = 'gpt-4o-mini',
    finalModel = 'gpt-4o',
    toolExecutor,
  }: {
    openai: OpenAI
    lightweightModel: string
    finalModel: string
    toolExecutor: ToolExecutor
  }) {
    this.openai = openai
    this.lightweightModel = lightweightModel
    this.finalModel = finalModel
    this.toolExecutor = toolExecutor
  }

  /**
   * Determines if a search is needed and detects the user's language.
   */
  private async decideSearchAndDetectLanguage(
    prompt: string,
    options: PartialChatCompletionCreateParams,
  ): Promise<{ searchQuery: string; language: string }> {
    try {
      const response = await this.openai.chat.completions.create({
        ...options,
        max_tokens: options.max_tokens || 100,
        model: this.lightweightModel,
        messages: [
          {
            role: 'system',
            content: `Analyze the user's input to determine if an internet search is needed and detect the language. Respond with a JSON object containing "searchQuery" and "language".`,
          },
          { role: 'user', content: prompt },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'decide_search_and_language',
              description:
                'Determines if a search is needed and detects language.',
              parameters: {
                type: 'object',
                properties: {
                  searchQuery: {
                    type: 'string',
                    description: 'Search query or empty.',
                  },
                  language: {
                    type: 'string',
                    description: 'Detected language code.',
                  },
                },
                required: ['searchQuery', 'language'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: 'auto',
        stream: false,
      })

      const toolCall = response.choices[0]?.message?.tool_calls?.[0]
      if (toolCall && toolCall.function.name === 'decide_search_and_language') {
        const parsedArgs = JSON.parse(toolCall.function.arguments || '{}')
        return {
          searchQuery: parsedArgs.searchQuery || '',
          language: parsedArgs.language || 'en',
        }
      }

      return { searchQuery: '', language: 'en' }
    } catch (error) {
      console.error('Error in decideSearchAndDetectLanguage:', error)
      return { searchQuery: '', language: 'en' }
    }
  }

  /**
   * Processes the user prompt and generates a response.
   */
  async processPrompt(
    prompt: string,
    userContext: string,
    options: PromptOptions = {
      lightweightModel: this.lightweightModel,
      finalModel: this.finalModel,
    },
  ): Promise<string> {
    try {
      const { searchQuery, language } =
        await this.decideSearchAndDetectLanguage(
          prompt,
          options.lightWeightModelOptions || {},
        )

      const searchResults = searchQuery
        ? await this.toolExecutor.performSearch(searchQuery)
        : ''

      const finalMessages: {
        role: 'system' | 'assistant' | 'user'
        content: string
      }[] = [{ role: 'system', content: userContext }]

      if (searchResults) {
        finalMessages.push({ role: 'system', content: searchResults })
      }

      finalMessages.push(
        {
          role: 'system',
          content: `The user's language is ${language}. Ensure the response is in this language.`,
        },
        { role: 'user', content: prompt },
      )

      const finalResponse = await this.openai.chat.completions.create({
        ...options.finalModelOptions,
        stream: false,
        model: this.finalModel,
        messages: finalMessages,
      })

      return (
        finalResponse.choices[0]?.message?.content?.trim() ??
        'No response generated.'
      )
    } catch (error) {
      console.error('Error processing prompt:', error)
      return 'An error occurred while processing your request.'
    }
  }
}
