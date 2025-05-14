export type ErrorResponse = {
  message: string;
  code: string;
};

export type RequestOptions = {
  method: 'GET' | 'POST';
  endpoint: string;
  params?: Record<string, unknown>;
  data?: unknown;
};
