import { useAuthorizationContext } from 'components/SwapAuthorizationProvider';
import { useQueryWrapper } from 'hooks';
import { maintenanceQuery, MaintenanceQueryType } from 'queries';

export const useFetchMaintenanceFlag = () => {
  const { client } = useAuthorizationContext();

  const { data } = useQueryWrapper<MaintenanceQueryType>({
    isPollingEnabled: true,
    queryOptions: { variables: {}, client },
    query: maintenanceQuery
  });

  return data?.factory.maintenance;
};
