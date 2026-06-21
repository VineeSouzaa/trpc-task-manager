export type Task = {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  active: boolean;
  completed: boolean;
};
