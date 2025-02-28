import { useEffect, useState } from 'react';
import { gql, useSubscription } from '@apollo/client';

export interface TokenMetadataChangedType {
  identifier: string;
  derivedEGLD: string;
  liquidityUSD: string;
  price: string;
}

const TOKEN_METADATA_SUBSCRIPTION = gql`
  subscription {
    tokenMetadataChanged {
      identifier
      derivedEGLD
      liquidityUSD
      price
    }
  }
`;

export const useTokenMetadataSubscription = () => {
  const [subscriptionPrices, setSubscriptionPrices] = useState<
    Record<string, string>
  >({});

  const { data: subscriptionData } = useSubscription(
    TOKEN_METADATA_SUBSCRIPTION
  );

  useEffect(() => {
    if (subscriptionData?.tokenMetadataChanged) {
      const { identifier, price } = subscriptionData.tokenMetadataChanged;
      setSubscriptionPrices((prev) => ({
        ...prev,
        [identifier]: price
      }));
    }
  }, [subscriptionData]);

  return {
    subscriptionPrices,
    subscriptionData
  };
};
