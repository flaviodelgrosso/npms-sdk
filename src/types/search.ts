export type SearchOptions = {
  /**
   * The offset in which to start searching from (max of 5000)
   *
   * Default value: `0`
   */
  from?: number;
  /**
   * The total number of results to return (max of 250)
   *
   * Default value: `25`
   */
  size?: number;
};

export type SuggestionsOptions = {
  /**
   * The total number of results to return (max of 100)
   *
   * Default value: `25`
   */
  size?: number;
};

export type SearchResult = {
  results: Result[];
  total: number;
};

interface Result {
  /** The package data which contains the name, version and other useful information */
  package: Package;
  /** The package flags (deprecated, unstable, insecure) */
  flags: Flags;
  /** The package score */
  score: Score;
  /** The computed search score (from Elasticsearch) */
  searchScore: number;
}

export interface SuggestionResult extends Result {
  /** A string containing highlighted matched text */
  highlight?: string;
}

type Author = {
  email?: string;
  name: string;
  url?: string;
  username?: string;
};

type Detail = {
  maintenance: number;
  popularity: number;
  quality: number;
};

type Flags = {
  deprecated?: boolean;
  insecure?: boolean;
  unstable?: boolean;
};

type Links = {
  bugs?: string;
  homepage?: string;
  npm: string;
  repository?: string;
};

type Package = {
  author?: Author;
  date: string;
  description: string;
  keywords?: string[];
  links: Links;
  maintainers: Publisher[];
  name: string;
  publisher: Publisher;
  scope: string;
  version: string;
};

type Publisher = {
  email: string;
  username: string;
};

type Score = {
  detail: Detail;
  final: number;
};
