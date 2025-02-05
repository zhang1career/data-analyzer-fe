export interface RespVo<V> {
  data: V | null;
  code: number;
  msg: string;
}