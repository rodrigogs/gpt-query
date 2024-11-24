import axios from 'axios';
import { load } from 'cheerio';

export class ToolExecutor {
  private readonly apiKey: string;
  private readonly cx: string;

  constructor(googleParams: { key: string; cx: string }) {
    this.apiKey = googleParams.key;
    this.cx = googleParams.cx;
  }

  /**
   * Performs a search using the Google Custom Search JSON API.
   * @param query - The search query string.
   * @returns A Promise that resolves to a formatted string with the search results.
   */
  async performSearch(query: string): Promise<string> {
    console.log(`Performing search for: "${query}"`);
    try {
      const response = await axios.get(
        'https://www.googleapis.com/customsearch/v1',
        {
          params: {
            key: this.apiKey,
            cx: this.cx,
            q: query,
          },
        },
      );

      const data = response.data as {
        items?: Array<{ title: string; link: string; snippet: string }>;
      };
      const items = data.items;

      if (!items || items.length === 0) {
        return `No results found for "${query}".`;
      }

      // Fetch details for the top 3 results
      const results = await Promise.all(
        items.slice(0, 3).map(async (item, index) => {
          const pageText = await this.fetchPageText(item.link);
          return `${index + 1}. **${item.title}**\n${item.link}\n\n${item.snippet}\n\n**Page Content Preview:**\n${pageText.slice(
            0,
            1000,
          )}...\n`;
        }),
      );

      return `**Search results for "${query}":**\n\n${results.join('\n')}`;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Specific handling for Axios errors
        console.error(
          'Error performing search:',
          error.response?.data || error.message,
        );
        return 'An error occurred while fetching the search results.';
      }
      // Fallback for non-Axios errors
      console.error('Unexpected error performing search:', error);
      return 'An unexpected error occurred.';
    }
  }

  /**
   * Fetches and extracts the main text content from a webpage.
   * @param url - The URL of the webpage.
   * @returns A Promise that resolves to the main text content of the page.
   */
  private async fetchPageText(url: string): Promise<string> {
    try {
      const response = await axios.get(url, { timeout: 5000 }); // Timeout added to prevent long waits
      const html = response.data as string;
      const $ = load(html);

      // Extract text from paragraphs
      const paragraphs = $('p')
        .map((_, el) => $(el).text().trim())
        .get()
        .filter((text) => text.length > 50) // Filter out very short text
        .join('\n\n');

      return paragraphs || 'Unable to extract meaningful page content.';
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Specific handling for Axios errors
        console.error(`Error accessing page ${url}:`, error.message);
        return 'Error accessing the page content.';
      }
      // Fallback for non-Axios errors
      console.error(`Unexpected error accessing page ${url}:`, error);
      return 'An unexpected error occurred while accessing the page content.';
    }
  }
}
