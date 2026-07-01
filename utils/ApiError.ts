interface IApiError<T = unknown> {
  readonly statusCode: number;
  readonly success: boolean;
  readonly errors: unknown[];
  readonly data: T | null;
}

class ApiError<T = unknown> extends Error implements IApiError<T> {
  readonly statusCode: number;
  readonly success = false;
  readonly errors: unknown[];
  readonly data: T | null;

  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: unknown[] = [],
    data: T | null = null,
    stack?: string,
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = data;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
