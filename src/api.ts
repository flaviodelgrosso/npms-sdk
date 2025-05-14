export const api = {
  search: () => '/search',
  suggestions: () => '/search/suggestions',
  packageInfo: (packageName: string) => `/package/${encodeURIComponent(packageName)}`,
  multiPackageInfo: () => '/package/mget',
} as const;
