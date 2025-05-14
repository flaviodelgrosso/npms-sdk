import { strictEqual } from 'node:assert';
import { describe, test } from 'node:test';

import { buildSearchQueryWithModifiers } from '../src/utils/query.ts';

describe('buildSearchQueryWithModifiers', () => {
  test('should build search query with modifiers', () => {
    const query = 'cross+spawn';
    const expectedQuery = 'cross+spawn+not:deprecated,insecure+scope:@types';
    const result = buildSearchQueryWithModifiers(query, {
      'not:': 'deprecated,insecure',
      'scope:': '@types',
    });
    strictEqual(result, expectedQuery);
  });

  test('should build search query with empty modifiers', () => {
    const query = 'cross+spawn';
    const result = buildSearchQueryWithModifiers(query, {});
    strictEqual(result, query);
  });

  test('should ignore invalid modifiers', () => {
    const query = 'cross-spawn';
    const result = buildSearchQueryWithModifiers(query, {
      // @ts-expect-error: TypeScript will complains but we want to test invalid modifiers
      'invalid:': 'value', // this is not in SearchQueryModifiers
      'scope:': '@types',
    });
    strictEqual(result, 'cross-spawn+scope:@types');
  });
});
