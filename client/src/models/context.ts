export type workflow = {
  name: string;
};

export type context = {
  id: string;
  name: string;
  active: boolean;
  create_at: Date;
  workflow: workflow[];
  Log: {
    workflow: {
      id: string;
      name: string;
      active: boolean;
      scheduled: boolean;
      context_id: string;
    };
  }[]
};
