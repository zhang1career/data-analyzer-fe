export interface FormableProps<V> {

  formData: V | null;

  setFormData: (data: V) => void;
}