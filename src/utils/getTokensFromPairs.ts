import { EsdtType, PairType } from 'types';

export const getTokensFromPairs = ({
  pairs,
  tokenRoute
}: {
  pairs: PairType[];
  tokenRoute: string[];
}) =>
  tokenRoute
    .map((identifier) => {
      const tokenFound = pairs
        .map(({ firstToken, secondToken }) => [firstToken, secondToken])
        .flat()
        .find((token) => token.identifier === identifier);

      return tokenFound;
    })
    .filter(Boolean) as EsdtType[];
