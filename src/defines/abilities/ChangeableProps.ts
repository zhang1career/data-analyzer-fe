export interface ChangeableProps<T> {
  onChange: (data: T) => void;
}