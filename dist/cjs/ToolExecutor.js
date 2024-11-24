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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolExecutor = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = require("cheerio");
class ToolExecutor {
    constructor(googleParams) {
        this.apiKey = googleParams.key;
        this.cx = googleParams.cx;
    }
    /**
     * Performs a search using the Google Custom Search JSON API.
     * @param query - The search query string.
     * @returns A Promise that resolves to a formatted string with the search results.
     */
    performSearch(query) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log(`Performing search for: "${query}"`);
            try {
                const response = yield axios_1.default.get('https://www.googleapis.com/customsearch/v1', {
                    params: {
                        key: this.apiKey,
                        cx: this.cx,
                        q: query,
                    },
                });
                const data = response.data;
                const items = data.items;
                if (!items || items.length === 0) {
                    return `No results found for "${query}".`;
                }
                // Fetch details for the top 3 results
                const results = yield Promise.all(items.slice(0, 3).map((item, index) => __awaiter(this, void 0, void 0, function* () {
                    const pageText = yield this.fetchPageText(item.link);
                    return `${index + 1}. **${item.title}**\n${item.link}\n\n${item.snippet}\n\n**Page Content Preview:**\n${pageText.slice(0, 1000)}...\n`;
                })));
                return `**Search results for "${query}":**\n\n${results.join('\n')}`;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    // Specific handling for Axios errors
                    console.error('Error performing search:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                    return 'An error occurred while fetching the search results.';
                }
                // Fallback for non-Axios errors
                console.error('Unexpected error performing search:', error);
                return 'An unexpected error occurred.';
            }
        });
    }
    /**
     * Fetches and extracts the main text content from a webpage.
     * @param url - The URL of the webpage.
     * @returns A Promise that resolves to the main text content of the page.
     */
    fetchPageText(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(url, { timeout: 5000 }); // Timeout added to prevent long waits
                const html = response.data;
                const $ = (0, cheerio_1.load)(html);
                // Extract text from paragraphs
                const paragraphs = $('p')
                    .map((_, el) => $(el).text().trim())
                    .get()
                    .filter((text) => text.length > 50) // Filter out very short text
                    .join('\n\n');
                return paragraphs || 'Unable to extract meaningful page content.';
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    // Specific handling for Axios errors
                    console.error(`Error accessing page ${url}:`, error.message);
                    return 'Error accessing the page content.';
                }
                // Fallback for non-Axios errors
                console.error(`Unexpected error accessing page ${url}:`, error);
                return 'An unexpected error occurred while accessing the page content.';
            }
        });
    }
}
exports.ToolExecutor = ToolExecutor;
