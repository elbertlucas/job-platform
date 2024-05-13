export type CreateLog = {
  id: string;
  workflow_name: string;
  workflow_id: string;
  context_id?: string;
  message?: string;
  code?: number;
  status: string;
};

export type Log = {
  id: string;
  workflow_name: string;
  workflow_id: string;
  context_id?: string;
  message?: string;
  code?: number;
  status: string;
  start_at: Date;
  finish_at?: Date;
};

export type UpdateLog = Partial<Log>;
