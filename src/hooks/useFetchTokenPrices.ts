import { gql } from '@apollo/client';
import { useQueryWrapper } from 'hooks';
import { FilteredTokensType } from 'types';

export const useFetchTokenPrices = ({
  skip = false,
  identifiers = [],
  isPollingEnabled = false
}: {
  skip?: boolean;
  identifiers?: string[];
  isPollingEnabled?: boolean;
}) => {
  const tokensQuery = gql`
    query swapPackageFilteredTokensPrices(
      $enabledSwaps: Boolean
      $pagination: ConnectionArgs
      $identifiers: [String!]
    ) {
      filteredTokens(
        pagination: $pagination
        filters: { enabledSwaps: $enabledSwaps, identifiers: $identifiers }
      ) {
        edges {
          node {
            identifier
            price
          }
        }
      }
    }
  `;

  const { data, isError, isLoading } = useQueryWrapper<{
    filteredTokens: FilteredTokensType;
  }>({
    isPollingEnabled,
    query: tokensQuery,
    queryOptions: {
      variables: {
        identifiers,
        pagination: {
          first: identifiers.length,
          after: ''
        }
      },
      skip: skip ?? identifiers.length === 0
    }
  });

  return {
    isTokenPricesError: isError,
    isTokenPricesLoading: isLoading,
    tokenPrices: data?.filteredTokens.edges
  };
};
