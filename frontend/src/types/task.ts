export interface Task {
  id?: string;
  title: string;
  category?: string;
  priority?: string;
  estimated_minutes?: number;
  due_date?: string;
  status?: string;
}
