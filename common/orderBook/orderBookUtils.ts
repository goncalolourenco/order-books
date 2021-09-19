const defaultThrottleTime = 1500;

export const getThrottleBasedOnCPUS: (numberCpus: number | undefined) => number = (numberCpus) => {
  if (!numberCpus || typeof numberCpus !== 'number') return defaultThrottleTime;

  if (numberCpus <= 4) {
    return 4000;
  } else if (numberCpus <= 8) {
    return 2500;
  }

  return defaultThrottleTime;
};
