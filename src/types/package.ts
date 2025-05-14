export type PackageInfo = {
  /** The date in which the package was last analyzed */
  analyzedAt: string;
  /** The collected information from all sources */
  collected: Collected;
  /** The package evaluation */
  evaluation: Evaluation;
  /** The package score */
  score: Score;
  /** The error associated with the last analyze attempt */
  error?: Error;
};

type Badge = {
  info: Info;
  urls: Urls;
};

type Collected = {
  github?: GitHub;
  metadata: Metadata;
  npm: Npm;
  source?: Source;
};

type Contributor = {
  commitsCount: number;
  username: string;
};

type Detail = {
  maintenance: number;
  popularity: number;
  quality: number;
};

type Error = {
  code: string;
  message: string;
};

type Evaluation = {
  maintenance: Maintenance;
  popularity: Popularity;
  quality: Quality;
};

type Files = {
  hasChangelog: boolean;
  readmeSize: number;
  testsSize: number;
};

type GitHub = {
  commits: Release[];
  contributors: Contributor[];
  forksCount: number;
  homepage?: string;
  issues: Issues;
  starsCount: number;
  statuses: Status[];
  subscribersCount: number;
};

type Issues = {
  count: number;
  distribution: Record<string, number>;
  isDisabled: boolean;
  openCount: number;
};

type Info = {
  modifiers?: Modifiers;
  service: string;
  type: string;
};

type Links = {
  bugs?: string;
  homepage?: string;
  npm: string;
  repository?: string;
};

type Maintenance = {
  commitsFrequency: number;
  issuesDistribution: number;
  openIssues: number;
  releasesFrequency: number;
};

type Metadata = {
  date: string;
  dependencies: Record<string, string>;
  description: string;
  hasSelectiveFiles?: boolean;
  hasTestScript?: boolean;
  keywords: string[];
  license: string;
  links: Links;
  maintainers: Publisher[];
  name: string;
  publisher: Publisher;
  readme?: string;
  releases: Release[];
  repository: Repository;
  scope: string;
  version: string;
};

type Modifiers = {
  type: string;
};

type Npm = {
  dependentsCount: number;
  downloads: Release[];
  starsCount: number;
};

type Popularity = {
  communityInterest: number;
  dependentsCount: number;
  downloadsAcceleration: number;
  downloadsCount: number;
};

type Publisher = {
  email?: string;
  username: string;
};

type Quality = {
  branding: number;
  carefulness: number;
  health: number;
  tests: number;
};

type Release = {
  count: number;
  from: string;
  to: string;
};

type Repository = {
  directory: string;
  type?: string;
  url: string;
};

type Score = {
  detail: Detail;
  final: number;
};

type Source = {
  badges: Badge[];
  coverage: number;
  files: Files;
  linters: string[];
};

type Status = {
  context: string;
  state: string;
};

type Urls = {
  content: string;
  original: string;
  service?: string;
  shields: string;
};
