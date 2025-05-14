/**
 All responses are JSON, including errors which have the following structure:
 ```
 {
   code: 'INTERNAL',
   message: 'An internal error occurred'
 }
 ```
 */
export class NpmsIOError extends Error {
  protected code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = 'NpmsIOError';
    this.code = code;
  }
}
