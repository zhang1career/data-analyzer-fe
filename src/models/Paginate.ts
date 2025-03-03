// todo: rename all models with 'Model' suffix

export interface Paginate<T> {
  data: T[];
  total_num: number;
}