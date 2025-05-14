# Npms.io TypeScript Client

[![NPM
version](https://img.shields.io/npm/v/npms-sdk.svg?style=flat)](https://www.npmjs.com/package/npms-sdk)
[![NPM
downloads](https://img.shields.io/npm/dm/npms-sdk.svg?style=flat)](https://www.npmjs.com/package/npms-sdk)
[![CI](https://github.com/flaviodelgrosso/npms-sdk/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/flaviodelgrosso/npms-sdk/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/flaviodelgrosso/npms-sdk/graph/badge.svg?token=FAWWPSCT1S)](https://codecov.io/gh/flaviodelgrosso/npms-sdk)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A modern TypeScript client library for the [npms.io](https://npms.io) API. This library provides a simple and type-safe way to interact with the npms.io search API.

## Features

- 🎯 Fully type-safe
- 🔍 Search capabilities with modifiers and filters
- 💡 NPM package suggestions
- ℹ️ Single and multi-package information retrieval
- 📦 Zero dependencies
- 🧪 100% test coverage

## Installation

```bash
npm install npms-sdk
```

## Usage

### Basic Search

```typescript
import { NpmsIO } from 'npms-sdk';

const npms = new NpmsIO();

// Search for packages
const { results, total } = await npms.executeSearchQuery('react');
console.log(`Total results: ${total}`);
for (const result of results) {
  console.log(result.package.description);
}
```

### Search with Modifiers

```typescript
const { results } = await client.executeSearchQuery('react', {
  size: 10,
  modifiers: {
    not: 'deprecated,insecure',
    author: 'facebook'
  }
});
```

### Get Package Suggestions

```typescript
const { flags, package, score, searchScore, highlight  } = await npms.searchSuggestions('react', { size: 5 });
```

### Get Package Information

```typescript
// Get info for a single package
const { analyzedAt, collected, evaluation, score } = await npms.getPackageInfo('react');

// Get info for multiple packages
const packages = await npms.getMultiPackageInfo(['react', 'typescript']);
console.log(packages.typescript.score)
```

## Search Modifiers

The search API supports various modifiers to filter results:

- `scope:types` - Show/filter results that belong to the @types scope
- `author:username` - Filter by package author
- `maintainer:username` - Filter by package maintainer
- `keywords:keyword1,keyword2` - Filter by keywords
- `not:deprecated` - Exclude deprecated packages
- `not:unstable` - Exclude packages with version < 1.0.0
- `not:insecure` - Exclude packages with security vulnerabilities
- `is:deprecated` - Show only deprecated packages
- `is:unstable` - Show packages with version < 1.0.0
- `is:insecure` - Show packages with security vulnerabilities
- `boost-exact:false` - Disable boosting exact matches

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Credits

This package is powered by the [npms.io](https://npms.io) API.
