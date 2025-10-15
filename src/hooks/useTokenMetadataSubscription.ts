import { useEffect, useState } from 'react';
import { gql, useSubscription } from '@apollo/client';

export interface TokenMetadataChangedType {
  identifier: string;
  price: string;
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
  const [subscriptionPrices, setSubscriptionPrices] = useState<
    Record<string, string>
  >({});

  const { data: subscriptionData } = useSubscription(
    TOKEN_METADATA_SUBSCRIPTION
  );

  useEffect(() => {
    console.log({ subscriptionData });

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
