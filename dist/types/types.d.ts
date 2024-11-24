import type { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
export type GoogleParams = {
    key: string;
    cx: string;
};
export type PartialChatCompletionCreateParams = Omit<ChatCompletionCreateParamsBase, 'model' | 'messages'>;
export type PromptOptions = {
    lightweightModel?: string;
    lightWeightModelOptions?: PartialChatCompletionCreateParams;
    finalModel?: string;
    finalModelOptions?: PartialChatCompletionCreateParams;
};
