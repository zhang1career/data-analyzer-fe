import {DependencyList, useEffect, useState} from "react";

export function useDelayEffect(callback: () => void,
                               dependencies: DependencyList,
                               timeoutInMilliseconds: number = 500) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      callback();
    }, timeoutInMilliseconds);
    return () => clearTimeout(timeoutId);
  }, dependencies);
}

export function ExpirableState<T>(expireInMilliseconds: number): [() => T | undefined, (data: T) => void] {
  const [data, setData] = useState<T>();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setData(undefined);
    }, expireInMilliseconds);

    return () => clearTimeout(timeoutId);
  }, [data, expireInMilliseconds]);

  return [(() => {
    return data;
  }), setData] as const;
}