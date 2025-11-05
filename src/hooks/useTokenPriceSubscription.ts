import { useEffect, useState } from 'react';
import { gql, useSubscription } from '@apollo/client';

export interface TokenPriceDateSubscriptionType {
  tokensPriceUpdated: {
    updates: string[][];
  };
}

export interface PriceSubscriptionType {
  price: string;
  timestamp: number;
}

const tokensPriceSubscriptionQuery = gql`
  subscription swapPackageTokensPriceUpdated {
    tokensPriceUpdated {
      updates
    }
  }
`;

export const useTokenPriceSubscription = () => {
  const [priceSubscriptions, setPriceSubscriptions] = useState<
    Record<string, PriceSubscriptionType>
  >({});

  const { data } = useSubscription<TokenPriceDateSubscriptionType>(
    tokensPriceSubscriptionQuery
  );

  useEffect(() => {
    if (!data?.tokensPriceUpdated) return;

    setPriceSubscriptions((prev) => {
      const updatedPriceSubscriptions = { ...prev };

      console.log(data?.tokensPriceUpdated);
      try {
        data?.tokensPriceUpdated.updates.forEach((entry) => {
          const identifier = entry[0];
          const price = entry[1];

          // Update the current token price
          updatedPriceSubscriptions[identifier] = {
            price,
            timestamp: Date.now()
          };
        });

        for (const entry in updatedPriceSubscriptions) {
          // prices older than 10s will be deleted
          if (Date.now() - updatedPriceSubscriptions[entry].timestamp > 10000) {
            delete updatedPriceSubscriptions[entry];
          }
        }
      } catch (e) {
        console.error('Failed to update prices: ', e);
      }

      return updatedPriceSubscriptions;
    });
  }, [data]);

  return {
    priceSubscriptions
  };
};
