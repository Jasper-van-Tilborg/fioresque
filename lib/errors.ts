export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  return "Er is iets misgegaan.";
}

export function apiErrorResponse(error: unknown, defaultStatus = 500): Response {
  const message = getErrorMessage(error);
  const status = error instanceof AppError ? error.statusCode : defaultStatus;
  return Response.json({ error: message }, { status });
}
