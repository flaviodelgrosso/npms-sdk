# npms.io

A lightweight and type-safe Node.js client library for the [npms.io](https://npms.io) API.

[![Test](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](coverage/lcov-report/index.html)
[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)

## Features

- 🚀 Lightweight and fast
- 📦 Zero dependencies
- 🔒 Fully type-safe with TypeScript
- 📝 Complete API coverage
- 💪 100% test coverage

## Installation

```bash
npm install npms-io
```

## Usage

```typescript
import { NpmsIO } from 'npms-io';

const client = new NpmsIO();

// Search for packages
const searchResults = await client.executeSearchQuery('typescript');
console.log(searchResults.results[0].package.name);

// Get package suggestions
const suggestions = await client.searchSuggestions('react');
console.log(suggestions[0].package.name);

// Get package information
const packageInfo = await client.getPackageInfo('typescript');
console.log(packageInfo.collected.metadata.version);

// Get multiple package information
const multiPackageInfo = await client.getMultiPackageInfo(['typescript', 'react']);
console.log(multiPackageInfo.typescript.collected.metadata.version);
```

## API

### `executeSearchQuery(query: string, options?: SearchOptions): Promise<SearchResult>`

Search for packages with support for qualifiers:

```typescript
// Basic search
const results = await client.executeSearchQuery('typescript');

// Search with qualifiers
const results = await client.executeSearchQuery('author:sindresorhus');

// Search with options
const results = await client.executeSearchQuery('react', { size: 10, from: 0 });
```

#### Supported Qualifiers

- `scope:types` - Show/filter results that belong to the `@types` scope
- `author:name` - Show/filter results by author
- `maintainer:name` - Show/filter results by maintainer
- `keywords:keyword` - Show/filter results by keywords (comma-separated, use `-keyword` to exclude)
- `not:deprecated` - Exclude deprecated packages
- `not:unstable` - Exclude packages with version < 1.0.0
- `not:insecure` - Exclude packages with security issues
- `is:deprecated` - Show only deprecated packages
- `is:unstable` - Show only packages with version < 1.0.0
- `is:insecure` - Show only packages with security issues

### `searchSuggestions(query: string, options?: SuggestionsOptions): Promise<SuggestionResult>`

Get package suggestions based on a search query:

```typescript
const suggestions = await client.searchSuggestions('react', { size: 5 });
```

### `getPackageInfo(packageName: string): Promise<PackageInfo>`

Get detailed information about a specific package:

```typescript
const info = await client.getPackageInfo('typescript');
```

### `getMultiPackageInfo(packageNames: string[]): Promise<Record<string, PackageInfo>>`

Get detailed information about multiple packages:

```typescript
const info = await client.getMultiPackageInfo(['typescript', 'react']);
```

## License

[ISC License](LICENSE) © 2025 Flavio Del Grosso
