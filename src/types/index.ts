export type SkipTime = { start: number; end: number };

export interface Captions {
  loading: boolean;
  data: SkipTime[];
  error?: string;
}

export interface MessageData {
  type: string;
  data?: any;
  response?: any;
}
