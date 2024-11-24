
# GPT Query

GPT Query is a tool designed to enhance OpenAI models with the capability to search for content on the internet using the Google API and web scraping.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Scripts](#scripts)
- [Development](#development)
- [Dependencies](#dependencies)
- [License](#license)

## Installation

Use npm or yarn to install the package and its dependencies:

```bash
npm install gpt-query
```

## Usage

### Importing the Library

Depending on your environment:

For ES Modules:
```javascript
import GPTQuery from 'gpt-query'
```

For CommonJS:
```javascript
const GPTQuery = require('gpt-query')
```

## Scripts

This project provides several npm scripts for development and production tasks:

- **Build Scripts:**
  - `npm run build:cjs`: Build CommonJS modules.
  - `npm run build:esm`: Build ES Modules.
  - `npm run build:types`: Generate type definitions.
  - `npm run build`: Run all build tasks.

- **Development Scripts:**
  - `npm run dev`: Run the development server using `tsx`.
  - `npm run watch`: Watch for file changes and recompile.

- **Linting:**
  - `npm run lint`: Check for linting errors using Biome.
  - `npm run lint:fix`: Fix linting issues automatically.
  - `npm run lint:fix:unsafe`: Fix linting issues, including unsafe fixes.

- **Testing:**
  - `npm run test`: Run all tests with Jest.

- **Cleaning:**
  - `npm run clean`: Remove all generated files.

## Development

To contribute or develop this project locally:

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build the project:
   ```bash
   npm run build
   ```

### Running Tests

Ensure your changes don't break functionality by running tests:

```bash
npm run test
```

## Dependencies

### Production

- **axios**: HTTP client for making API requests.
- **cheerio**: Scraping and parsing HTML.
- **dotenv**: Environment variable management.
- **openai**: Integration with OpenAI GPT.

### Development

- **@biomejs/biome**: Linting tool.
- **@types/jest**: TypeScript definitions for Jest.
- **jest**: Testing framework.
- **tsx**: TypeScript execution.
- **ts-mockito**: Mocking library for TypeScript.
- **typescript**: TypeScript language support.

## License

This project is licensed under the ISC License. See the `LICENSE` file for more details.
