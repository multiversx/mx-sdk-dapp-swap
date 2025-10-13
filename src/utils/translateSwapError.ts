const errorMap: Record<string, string> = {
  'Multi swap disabled!':
    'Smart Swaps are temporarily disabled. We suggest using an alternative route to perform the token swap.',
  'Spread too big!':
    'Smart Swap not possible because you would lose more than $placeholder_percentage%.'
};

export const translateSwapError = ({
  serviceError,
  lossPercentage = ''
}: {
  serviceError?: string;
  lossPercentage?: string;
}) => {
  if (!serviceError) return;

  const defaultTranslation = 'No trade route found.';
  const foundErrorKey = Object.keys(errorMap).find((key) =>
    serviceError.includes(key)
  );

  if (foundErrorKey) {
    const translatedError = errorMap[foundErrorKey];

    return translatedError.replace('$placeholder_percentage', lossPercentage);
  }

  return defaultTranslation;
};
