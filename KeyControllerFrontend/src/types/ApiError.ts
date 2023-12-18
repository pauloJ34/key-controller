import { AxiosError } from 'axios';

export type ApiError = AxiosError<{
  message: string;
  error: string;
  path: string;
  status: number;
  timestamp: Date;
}>;
