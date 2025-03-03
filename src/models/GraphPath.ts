// todo: rename all models with 'Model' suffix

export interface GraphPath {
  id: string;
  startId: string;
  stopId: string;
  label: string;
  isReverse: boolean;
}

export function metaEqual(a: GraphPath, b: GraphPath): boolean {
  return a.label === b.label && a.isReverse === b.isReverse;
}