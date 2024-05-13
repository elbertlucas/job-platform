type workflowPrismaType = {
  name: string;
  id: string;
  active: boolean;
  scheduled: boolean;
  context_id: string;
  Log: {
    workflow: {
      id: string;
      name: string;
      active: boolean;
      scheduled: boolean;
      context_id: string;
    };
  }[];
  Task: {
    name: string;
    id: string;
    cron_time: string;
    label: string;
    active: boolean;
  }[];
};

export function workflowMapper(wk: workflowPrismaType) {
  if (!wk) return undefined;

  const output = {
    id: wk.id,
    name: wk.name,
    active: wk.active,
    scheduled: wk.scheduled,
    context_id: wk.context_id,
    logs: wk.Log,
    tasks: wk.Task.map((task) => {
      return {
        id: task.id,
        name: task.name,
        cron_time: task.cron_time,
        label: task.label,
        active: task.active,
      };
    }),
  };
  return output;
}
