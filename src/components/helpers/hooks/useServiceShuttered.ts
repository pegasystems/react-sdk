import { useEffect, useState } from 'react';
import { getServiceShutteredStatus } from '../utils';

export default function useServiceShuttered(): boolean {
  const [serviceShuttered, setServiceShuttered] = useState<boolean>(false);

  useEffect(() => {
    const isServiceShuttered = async () => {
      try {
        const status = await getServiceShutteredStatus();
        setServiceShuttered(status);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        setServiceShuttered(false);
      }
    };

    isServiceShuttered();
  }, []);

  return serviceShuttered;
}
