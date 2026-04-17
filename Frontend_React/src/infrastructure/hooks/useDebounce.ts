import { useEffect, useState } from "react"

/**
 * This hook can be used to debounce (delay the variable change) of a given variable with the given delay in milliseconds.
 * Use the debounced value that is returned by the hook, an example would be for debouncing searches for values in the backend.
 */
function useDebounce<T>(value: T, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(
      () => {
        const handler = setTimeout(() => {
          setDebouncedValue(value);
        }, delay);
        return () => {
          clearTimeout(handler);
        };
      },
      [value, delay]
    );
    return debouncedValue;
}

export default useDebounce;