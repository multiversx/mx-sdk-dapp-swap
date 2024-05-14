import { gql } from '@apollo/client';
import { useQueryWrapper } from 'hooks';
import { EsdtType } from 'types';

export const useFetchTokenPrices = ({
  isPollingEnabled = false
}: {
  isPollingEnabled?: boolean;
}) => {
  const tokensQuery = gql`
    query {
      tokens {
        price
        identifier
      }
    }
  `;

  const { data, isError, isLoading } = useQueryWrapper<{ tokens: EsdtType[] }>({
    isPollingEnabled,
    query: tokensQuery,
    queryOptions: {
      skip: !isPollingEnabled
    }
  });

  return {
    tokenPrices: data?.tokens,
    isTokenPricesError: isError,
    isTokenPricesLoading: isLoading
  };
};
