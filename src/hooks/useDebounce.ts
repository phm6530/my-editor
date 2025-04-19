import { useCallback, useRef } from "react";

export default function useDebounce(defaultDelay: number = 300) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debounce = useCallback(
    <T extends (...args: any[]) => void>(
      cb: T,
      delay: number = defaultDelay
    ) => {
      return (...args: Parameters<T>) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          cb(...args);
        }, delay);
      };
    },
    [defaultDelay]
  );

  return { debounce };
}
