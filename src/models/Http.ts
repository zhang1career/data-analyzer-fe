export interface ResponseObj<V> {
  data: V;
  code: number;
  msg: string;
}