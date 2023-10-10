const errorMap: Record<string, string> = {
  'Multi swap disabled!':
    'Smart Swaps are temporarily disabled. We suggest using an alternative route to perform the token swap.',
  'Spread too big!':
    'Smart Swap not possible because you would lose more than 5%.'
};

export const translateSwapError = (serviceError: string) => {
  const defaultTranslation = 'No swap route found.';
  const foundErrorKey = Object.keys(errorMap).find((key) =>
    serviceError.includes(key)
  );

  if (foundErrorKey) {
    return errorMap[foundErrorKey];
  }

  return defaultTranslation;
};
