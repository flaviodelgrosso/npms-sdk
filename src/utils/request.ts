import { NpmsIOError } from '../error.ts';
import type { ErrorResponse, RequestOptions } from '../types/fetch.ts';

const DEFAULT_API_URL = 'https://api.npms.io/v2';

export async function request<T>({ method, endpoint, params, data }: RequestOptions): Promise<T> {
  const url = new URL(`${DEFAULT_API_URL}${endpoint}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.append(key, String(value));
    }
  }

  const options: RequestInit = {
    method,
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      'Content-Type': 'application/json',
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
