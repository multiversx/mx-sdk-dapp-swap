import { useMemo } from 'react';
import { useAuthorizationContext } from 'components/SwapAuthorizationProvider';
import { useQueryWrapper } from 'hooks';
import { maintenanceQuery, MaintenanceQueryType } from 'queries';

export const useFetchMaintenanceFlag = ({
  isPollingEnabled,
  pollingIntervalMiliseconds = 30000 //30s
}: {
  pollingIntervalMiliseconds?: number;
  isPollingEnabled?: boolean;
}) => {
  const { client } = useAuthorizationContext();

  const { data } = useQueryWrapper<MaintenanceQueryType>({
    isPollingEnabled,
    pollingIntervalMiliseconds,
    queryOptions: { variables: {}, client },
    query: maintenanceQuery
  });

  const isMaintenance = useMemo(
    () => data?.factory.maintenance,
    [data?.factory.maintenance]
  );

  return isMaintenance;
};
