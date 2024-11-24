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
exports.PromptProcessor = void 0;
class PromptProcessor {
    constructor({ openai, lightweightModel = 'gpt-4o-mini', finalModel = 'gpt-4o', toolExecutor, }) {
        this.openai = openai;
        this.lightweightModel = lightweightModel;
        this.finalModel = finalModel;
        this.toolExecutor = toolExecutor;
    }
    /**
     * Determines if a search is needed and detects the user's language.
     */
    decideSearchAndDetectLanguage(prompt, options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const response = yield this.openai.chat.completions.create(Object.assign(Object.assign({}, options), { max_tokens: options.max_tokens || 100, model: this.lightweightModel, messages: [
                        {
                            role: 'system',
                            content: `Analyze the user's input to determine if an internet search is needed and detect the language. Respond with a JSON object containing "searchQuery" and "language".`,
                        },
                        { role: 'user', content: prompt },
                    ], tools: [
                        {
                            type: 'function',
                            function: {
                                name: 'decide_search_and_language',
                                description: 'Determines if a search is needed and detects language.',
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
                    ], tool_choice: 'auto', stream: false }));
                const toolCall = (_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.tool_calls) === null || _c === void 0 ? void 0 : _c[0];
                if (toolCall && toolCall.function.name === 'decide_search_and_language') {
                    const parsedArgs = JSON.parse(toolCall.function.arguments || '{}');
                    return {
                        searchQuery: parsedArgs.searchQuery || '',
                        language: parsedArgs.language || 'en',
                    };
                }
                return { searchQuery: '', language: 'en' };
            }
            catch (error) {
                console.error('Error in decideSearchAndDetectLanguage:', error);
                return { searchQuery: '', language: 'en' };
            }
        });
    }
    /**
     * Processes the user prompt and generates a response.
     */
    processPrompt(prompt_1, userContext_1) {
        return __awaiter(this, arguments, void 0, function* (prompt, userContext, options = {
            lightweightModel: this.lightweightModel,
            finalModel: this.finalModel,
        }) {
            var _a, _b, _c, _d;
            try {
                const { searchQuery, language } = yield this.decideSearchAndDetectLanguage(prompt, options.lightWeightModelOptions || {});
                const searchResults = searchQuery
                    ? yield this.toolExecutor.performSearch(searchQuery)
                    : '';
                const finalMessages = [{ role: 'system', content: userContext }];
                if (searchResults) {
                    finalMessages.push({ role: 'system', content: searchResults });
                }
                finalMessages.push({
                    role: 'system',
                    content: `The user's language is ${language}. Ensure the response is in this language.`,
                }, { role: 'user', content: prompt });
                const finalResponse = yield this.openai.chat.completions.create(Object.assign(Object.assign({}, options.finalModelOptions), { stream: false, model: this.finalModel, messages: finalMessages }));
                return ((_d = (_c = (_b = (_a = finalResponse.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim()) !== null && _d !== void 0 ? _d : 'No response generated.');
            }
            catch (error) {
                console.error('Error processing prompt:', error);
                return 'An error occurred while processing your request.';
            }
        });
    }
}
exports.PromptProcessor = PromptProcessor;
