import { useEffect, useState, useRef } from 'react';

export function useThrottle<T>(value: T, interval = 500): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}

type HardwareResponse = {
  unsupported: boolean;
  numberOfLogicalProcessors?: number;
};

export const useHardwareConcurrency: () => HardwareResponse = () => {
  let initialHardwareConcurrency: HardwareResponse;
  if (typeof navigator !== 'undefined' && 'hardwareConcurrency' in navigator) {
    initialHardwareConcurrency = {
      unsupported: false,
      numberOfLogicalProcessors: navigator.hardwareConcurrency,
    };
  } else {
    initialHardwareConcurrency = { unsupported: true };
  }

  return { ...initialHardwareConcurrency };
};

export function useFocus(): boolean {
  const [isFocus, setIsFocus] = useState<boolean>(true);

  useEffect(() => {
    const handleFocusChange = () => setIsFocus(true);
    const handleBlurChange = () => setIsFocus(false);

    window.addEventListener('focus', handleFocusChange);
    window.addEventListener('blur', handleBlurChange);

    return () => {
      window.removeEventListener('focus', handleFocusChange);
      window.removeEventListener('focblurus', handleBlurChange);
    };
  }, []);

  return isFocus;
}

export type SortDirection = 'ASC' | 'DESC';

export const sortFunctions = {
  ASC: function (a: number, b: number) {
    return a - b;
  },
  DESC: function (a: number, b: number) {
    return b - a;
  },
};

export const getMax = (a: number = 0, b: number = 0) => {
  if (a > b) return a;

  return b;
};

function getThousandsGroupRegex() {
  return /(\d)(?=(\d{3})+(?!\d))/g;
}

export function applyThousandSeparator(
  nmbr: number | string,
  thousandSeparator: string = ','
) {
  const str = nmbr + '';
  const thousandsGroupRegex = getThousandsGroupRegex();
  let index = str.search(/[1-9]/);
  index = index === -1 ? str.length : index;

  return (
    str.substring(0, index) +
    str
      .substring(index, str.length)
      .replace(thousandsGroupRegex, '$1' + thousandSeparator)
  );
}
