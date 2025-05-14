const SearchQueryModifiers = [
  'scope',
  'author',
  'maintainer',
  'keywords',
  'not',
  'is',
  'boost-exact',
  'score-effect',
  'quality-weight',
  'popularity-weight',
  'maintenance-weight',
] as const;

type SearchQueryModifier = (typeof SearchQueryModifiers)[number];

export type SearchQueryModifiers = Partial<Record<SearchQueryModifier, string>>;
/**
 *
 * @param query
 * @param modifiers
 * @description Return query string with modifiers
 * @example buildSearchQueryWithModifiers('cross+spawn', { 'not': 'deprecated,insecure' });
 */
export function buildSearchQueryWithModifiers(
  query: string,
  modifiers: SearchQueryModifiers,
): string {
  const queryWithModifiers = Object.entries(modifiers).reduce((acc, [key, value]) => {
    if (SearchQueryModifiers.includes(key as SearchQueryModifier)) {
      return `${acc}+${key}:${value}`;
    }
    return acc;
  }, query);

  return queryWithModifiers.trim();
}
