import type { ActionPostResponse } from '../api';

export const isSignTransactionError = (
  data:
    | { signature: string }
    | { error: string | { code: number; message: string } },
): data is { error: string } => !!(data as any).error;

export const isPostRequestError = (
  data:
    | ActionPostResponse
    | { error: string | { code: number; message: string } },
): data is { error: string } => !!(data as any).error;
