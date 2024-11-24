export declare class ToolExecutor {
    private readonly apiKey;
    private readonly cx;
    constructor(googleParams: {
        key: string;
        cx: string;
    });
    /**
     * Performs a search using the Google Custom Search JSON API.
     * @param query - The search query string.
     * @returns A Promise that resolves to a formatted string with the search results.
     */
    performSearch(query: string): Promise<string>;
    /**
     * Fetches and extracts the main text content from a webpage.
     * @param url - The URL of the webpage.
     * @returns A Promise that resolves to the main text content of the page.
     */
    private fetchPageText;
}
