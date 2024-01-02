import { useEffect, useState } from 'react';
import { getServiceShutteredStatus } from '../utils';

export default function ServiceShuttered() {
  const [serviceShuttered, setServiceShuttered] = useState(false);

  async function isServiceShuttered() {
    try {
      const status = await getServiceShutteredStatus();
      setServiceShuttered(status);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      setServiceShuttered(false);
    }
  }

  useEffect(() => {
    isServiceShuttered();
  }, []);

  return { serviceShuttered };
}
