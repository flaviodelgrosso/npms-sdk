import { api } from './api.ts';
import { NpmsIOError } from './error.ts';
import type { ErrorResponse, RequestOptions } from './types/fetch.ts';
import type { MultiPackageInfo, PackageInfo } from './types/package.ts';
import type {
  SearchOptions,
  SearchResult,
  SuggestionResult,
  SuggestionsOptions,
} from './types/search.ts';
import { type SearchQueryModifiers, buildSearchQueryWithModifiers } from './utils/query.ts';

const DEFAULT_API_URL = 'https://api.npms.io/v2';

interface NpmsIOOptions extends Pick<RequestInit, 'signal' | 'headers'> {
  /**
   * The base URL of the NPMS API.
   * @default 'https://api.npms.io/v2'
   */
  url?: string;
}

export default class NpmsIO {
  private url: string;
  private signal?: AbortSignal | null;
  private headers?: HeadersInit;

  constructor({ url, signal, headers }: NpmsIOOptions) {
    this.url = url || DEFAULT_API_URL;
    this.signal = signal;
    this.headers = headers;
  }

  /**
   * Perform a search query.
   * @param query Besides normal text, `q` supports qualifiers to express filters and other modifiers:
   * - `scope:types` Show/filter results that belong to the `@types` scope
   * - `author:sindresorhus` Show/filter results in which `sindresorhus` is the author
   * - `maintainer:sindresorhus` Show/filter results in which `sindresorhus` is qualifier as a maintainer
   * - `keywords:gulpplugin` Show/filter results that have `gulpplugin` in the keywords (separate multiple keywords with commas, you may also exclude keywords e.g.: `-framework`)
   * - `not:deprecated` Exclude deprecated packages from the results
   * - `not:unstable` Exclude packages whose version is `< 1.0.0`
   * - `not:insecure` Exclude packages that are insecure or have vulnerable dependencies (as per [nsp](https://nodesecurity.io/))
   * - `is:deprecated` Show/filter is deprecated packages
   * - `is:unstable` Show/filter packages whose version is `< 1.0.0`
   * - `is:insecure` Show/filter packages that are insecure or have vulnerable dependencies (as per [nsp](https://nodesecurity.io/))
   * - `boost-exact:false` Do not boost exact matches, defaults to `true`
   * - `score-effect:14` Set the effect that package scores have for the final search score, defaults to `15.3`
   * - `quality-weight:1` Set the weight that quality has for the each package score, defaults to `1.95`
   * - `popularity-weight:1` Set the weight that popularity has for the each package score, defaults to `3.3`
   * - `maintenance-weight:1` Set the weight that quality has for the each package score, defaults to `2.05`
   * @param options Additional search options
   * @see https://api-docs.npms.io/#api-Search-ExecuteSearchQuery
   */
  public executeSearchQuery(
    query: string,
    options?: SearchOptions & { modifiers?: SearchQueryModifiers },
  ): Promise<SearchResult> {
    const { modifiers, ...searchOptions } = options || {};
    const queryWithModifiers = modifiers ? buildSearchQueryWithModifiers(query, modifiers) : query;

    return this.#__request<SearchResult>({
      method: 'GET',
      endpoint: api.search(),
      params: {
        q: queryWithModifiers,
        ...searchOptions,
      },
    });
  }

  /**
   * Fetch suggestions.
   * @param query Perform a search query
   * @param options Additional suggestion options
   * @see https://api-docs.npms.io/#api-Search-SearchSuggestions
   */
  public searchSuggestions(query: string, options?: SuggestionsOptions): Promise<SuggestionResult> {
    return this.#__request<SuggestionResult>({
      method: 'GET',
      endpoint: api.suggestions(),
      params: {
        q: query,
        ...options,
      },
    });
  }

  /**
   * Get package info.
   * @param packageName The package name
   * @see https://api-docs.npms.io/#api-Package-GetPackageInfo
   */
  public getPackageInfo(packageName: string): Promise<PackageInfo> {
    return this.#__request<PackageInfo>({
      method: 'GET',
      endpoint: api.packageInfo(packageName),
    });
  }

  /**
   * Get various packages info.
   * @param packageNames The package names
   * @see https://api-docs.npms.io/#api-Package-GetMultiPackageInfo
   */
  public getMultiPackageInfo<const TPackages extends ReadonlyArray<string>>(
    packageNames: TPackages,
  ): Promise<MultiPackageInfo<TPackages>> {
    return this.#__request<MultiPackageInfo<TPackages>>({
      method: 'POST',
      endpoint: api.multiPackageInfo(),
      data: packageNames,
    });
  }

  async #__request<T>({ method, endpoint, params, data }: RequestOptions): Promise<T> {
    const url = new URL(`${this.url}${endpoint}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, String(value));
      }
    }

    const options: RequestInit = {
      method,
      body: data ? JSON.stringify(data) : undefined,
      signal: this.signal,
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
      },
    };

    let urlString = url.origin + url.pathname; // Base path; path segments like %2F remain encoded.
    if (url.search) {
      // url.search is the raw, percent-encoded query string (e.g., "?q=scope%3Atypes") or empty.
      // This is needed to make npms.io API happy with the modifiers,
      // as it expects special characters (e.g., ':') in query values to be unencoded.
      // decodeURIComponent("?q=scope%3Atypes") results in "?q=scope:types".
      urlString += decodeURIComponent(url.search);
    }

    const response = await fetch(urlString, options);
    const responseData = await response.json();

    if (!response.ok) {
      const error = responseData as ErrorResponse;
      throw new NpmsIOError(error.message, error.code);
    }

    return responseData as T;
  }
}
