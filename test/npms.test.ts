import { ok, rejects, strictEqual } from 'node:assert';
import { describe, mock, test } from 'node:test';
import NpmsIO from '../src/npms.ts';

describe('NpmsIO', () => {
  const client = new NpmsIO();
  const mockedFetch = mock.method(globalThis, 'fetch');

  test('should search for packages', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            total: 1,
            results: [
              {
                package: {
                  name: 'cross-spawn',
                },
              },
            ],
          }),
        }) as Response,
    );

    const result = await client.executeSearchQuery('cross-spawn');
    ok(result.total > 0);
    ok(Array.isArray(result.results));
    ok(result.results[0].package.name.includes('cross-spawn'));
  });

  test('should handle network errors', async () => {
    mockedFetch.mock.mockImplementationOnce(async () => {
      throw new Error('Network error');
    });

    await rejects(() => client.executeSearchQuery('test'), /Network error/);
  });

  test('should search with options', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            total: 1,
            results: [
              {
                package: {
                  name: 'cross-spawn',
                },
              },
            ],
          }),
        }) as Response,
    );

    const result = await client.executeSearchQuery('cross-spawn', { size: 1 });
    strictEqual(result.results.length, 1);
  });

  test('should search with modifiers', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            total: 1,
            results: [
              {
                package: {
                  name: 'cross-spawn',
                },
              },
            ],
          }),
        }) as Response,
    );

    const result = await client.executeSearchQuery('cross-spawn', {
      size: 1,
      modifiers: {
        not: 'deprecated,insecure',
      },
    });
    strictEqual(result.results.length, 1);
    ok(result.results[0].package.name.includes('cross-spawn'));
  });

  test('shoud throw error when search fails', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: false,
          status: 500,
          json: async () => ({
            code: 'NOT_FOUND',
            message: 'Module not found',
          }),
        }) as Response,
    );

    await rejects(
      () => client.executeSearchQuery('this-is-an-invalid-package-12345'),
      /^NpmsIOError: Module not found$/,
    );
  });

  test('should ignore invalid modifiers', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            total: 1,
            results: [
              {
                package: {
                  name: 'cross-spawn',
                },
              },
            ],
          }),
        }) as Response,
    );
    const result = await client.executeSearchQuery('cross-spawn', {
      size: 1,
      modifiers: {
        // @ts-expect-error
        'invalid-modifier:': 'invalid-modifier',
      },
    });
    strictEqual(result.results.length, 1);
    ok(result.results[0].package.name.includes('cross-spawn'));
  });

  test('should get package suggestions', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => [
            {
              package: {
                name: 'react',
              },
            },
          ],
        }) as Response,
    );

    const result = await client.searchSuggestions('react');
    ok(Array.isArray(result));
    ok(result.length > 0);
    ok(result[0].package.name.includes('react'));
  });

  test('should get suggestions with options', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => [
            {
              package: {
                name: 'react',
              },
            },
          ],
        }) as Response,
    );

    const result = await client.searchSuggestions('react', { size: 3 });
    ok(Array.isArray(result));
    ok(result.length > 0);
    ok(result.length <= 3);
  });

  test('should get package information', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            analyzedAt: new Date().toISOString(),
            collected: {
              metadata: {
                name: 'typescript',
              },
            },
          }),
        }) as Response,
    );

    const result = await client.getPackageInfo('typescript');
    ok(result.analyzedAt);
    strictEqual(result.collected.metadata.name, 'typescript');
  });

  test('should handle nonexistent package', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: false,
          status: 404,
          json: async () => ({
            code: 'NOT_FOUND',
            message: 'Module not found',
          }),
        }) as Response,
    );

    await rejects(
      () => client.getPackageInfo('this-package-definitely-does-not-exist-12345'),
      /^NpmsIOError: Module not found$/,
    );
  });

  test('should get multiple package information', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: true,
          json: async () => ({
            typescript: {
              analyzedAt: new Date().toISOString(),
              collected: {
                metadata: {
                  name: 'typescript',
                },
              },
            },
            react: {
              analyzedAt: new Date().toISOString(),
              collected: {
                metadata: {
                  name: 'react',
                },
              },
            },
          }),
        }) as Response,
    );

    const packages = ['typescript', 'react'];
    const result = await client.getMultiPackageInfo(packages);
    ok(result.typescript);
    ok(result.react);
    strictEqual(result.typescript.collected.metadata.name, 'typescript');
    strictEqual(result.react.collected.metadata.name, 'react');
  });

  test('should handle nonexistent package in multi package info', async () => {
    mockedFetch.mock.mockImplementationOnce(
      async () =>
        ({
          ok: false,
          status: 404,
          json: async () => ({
            code: 'NOT_FOUND',
            message: 'Module not found',
          }),
        }) as Response,
    );

    const packages = ['this-package-definitely-does-not-exist-12345'];
    await rejects(() => client.getMultiPackageInfo(packages), /^NpmsIOError: Module not found$/);
  });
});
