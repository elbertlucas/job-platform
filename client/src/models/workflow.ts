export interface WorkflowType {
  id: string;
  name: string;
  active: boolean;
  scheduled: boolean;
  context_id: string;
  logs: [];
  tasks: Task[];
}

export interface Task {
  id: string;
  name: string;
  cron_time: string;
  label: string;
  active: boolean;
}
