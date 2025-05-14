import { ok, rejects, strictEqual } from 'node:assert';
import { describe, test } from 'node:test';
import NpmsIO from '../../src/npms.ts';

describe('NpmsIO (integration)', () => {
  const client = new NpmsIO();

  describe('executeSearchQuery', () => {
    test('should search for packages', async () => {
      const result = await client.executeSearchQuery('cross-spawn');
      ok(result.total > 0);
      ok(Array.isArray(result.results));
      ok(result.results[0].package.name.includes('cross-spawn'));
    });

    test('should search with options', async () => {
      const result = await client.executeSearchQuery('react', { size: 1 });
      strictEqual(result.results.length, 1);
    });

    test('should search with modifiers', async () => {
      const result = await client.executeSearchQuery('react', {
        size: 2,
        modifiers: {
          not: 'deprecated,insecure',
        },
      });
      strictEqual(result.results.length, 2);
      ok(result.results[0].package.name.includes('react'));
    });

    test('should ignore invalid modifiers', async () => {
      const result = await client.executeSearchQuery('react', {
        size: 2,
        modifiers: {
          // @ts-expect-error
          invalid: 'invalid-modifier',
        },
      });
      strictEqual(result.results.length, 2);
      ok(result.results[0].package.name.includes('react'));
    });
  });

  describe('searchSuggestions', () => {
    test('should get package suggestions', async () => {
      const result = await client.searchSuggestions('react');
      ok(Array.isArray(result));
      ok(result.length > 0);
      ok(result[0].package.name.includes('react'));
    });

    test('should get suggestions with options', async () => {
      const result = await client.searchSuggestions('react', { size: 3 });
      ok(Array.isArray(result));
      ok(result.length > 0);
      ok(result.length <= 3);
    });
  });

  describe('getPackageInfo', () => {
    test('should get package information', async () => {
      const result = await client.getPackageInfo('typescript');
      ok(result.analyzedAt);
      strictEqual(result.collected.metadata.name, 'typescript');
    });

    test('should handle nonexistent package', async () => {
      await rejects(
        () => client.getPackageInfo('this-package-definitely-does-not-exist-12345'),
        /^NpmsIOError: Module not found$/,
      );
    });
  });

  describe('getMultiPackageInfo', () => {
    test('should get multiple package information', async () => {
      const packages = ['typescript', 'react'] as const;
      const result = await client.getMultiPackageInfo(packages);
      ok(result.typescript);
      ok(result.react);
      strictEqual(result.typescript.collected.metadata.name, 'typescript');
      strictEqual(result.react.collected.metadata.name, 'react');
    });

    test('should handle partial failures gracefully', async () => {
      const packages = ['typescript', 'this-package-definitely-does-not-exist-12345'] as const;
      const result = await client.getMultiPackageInfo(packages);
      ok(result.typescript);
      strictEqual(result.typescript.collected.metadata.name, 'typescript');
      strictEqual(result['this-package-definitely-does-not-exist-12345'], undefined);
    });
  });
});
