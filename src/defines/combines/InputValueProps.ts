export interface InputValueProps<V> {
  /**
   *
   */
  checkBlank: (data: V | null) => boolean;

  /**
   * Get the trimmed data from the input.
   */
  getTrimmedValue?: (data: V) => V;
}