import { WorkflowType } from "./workflow";

export type logs = {
  id: string;
  workflow: WorkflowType
  context: {
    name: string;
  };
  message: string;
  code: number;
  start_at: Date;
  finish_at: Date;
  status: string;
};
