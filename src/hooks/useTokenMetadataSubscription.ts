import { useEffect, useState } from 'react';
import { gql, useSubscription } from '@apollo/client';

export interface TokenMetadataChangedType {
  tokenMetadataChanged: {
    identifier: string;
    price: string;
  };
}

export interface PriceSubscriptionType {
  price: string;
  timestamp: number;
}

const TOKEN_METADATA_SUBSCRIPTION = gql`
  subscription {
    tokenMetadataChanged {
      identifier
      price
    }
  }
`;

export const useTokenMetadataSubscription = () => {
  const [priceSubscriptions, setPriceSubscriptions] = useState<
    Record<string, PriceSubscriptionType>
  >({});

  const { data } = useSubscription<TokenMetadataChangedType>(
    TOKEN_METADATA_SUBSCRIPTION
  );

  useEffect(() => {
    if (!data?.tokenMetadataChanged) return;

    setPriceSubscriptions((prev) => {
      const updatedPriceSubscriptions = { ...prev };
      const { identifier, price } = data?.tokenMetadataChanged;

      // Update the current symbol
      updatedPriceSubscriptions[identifier] = { price, timestamp: Date.now() };

      for (const sym in updatedPriceSubscriptions) {
        // prices older than 10s will be deleted
        if (Date.now() - updatedPriceSubscriptions[sym].timestamp > 10000) {
          delete updatedPriceSubscriptions[sym];
        }
      }

      return updatedPriceSubscriptions;
    });
  }, [data]);

  return {
    priceSubscriptions
  };
};
