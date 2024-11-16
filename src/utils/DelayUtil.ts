import {DependencyList, useEffect, useState} from "react";

export function useDelayEffect(callback: () => void, dependencies: DependencyList, timeoutInSeconds: number = 500) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      callback();
    }, timeoutInSeconds);
    return () => clearTimeout(timeoutId);
  }, dependencies);
}

export function ExpirableState<T>(expireInSeconds: number): [() => T | undefined, (data: T) => void] {
  const [data, setData] = useState<T>();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setData(undefined);
    }, expireInSeconds);

    return () => clearTimeout(timeoutId);
  }, [data]);

  return [(() => {return data;}), setData] as const;
}