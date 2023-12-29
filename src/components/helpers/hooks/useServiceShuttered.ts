import { useEffect, useState } from 'react';
import { getServiceShutteredStatus } from '../utils';

export default function ServiceShuttered() {
  const [serviceShuttered, setServiceShuttered] = useState(false);

  async function isServiceShuttered() {
    try {
      const status = await getServiceShutteredStatus();
      setServiceShuttered(status);
    } catch {}
  }

  useEffect(() => {
    isServiceShuttered();
  }, []);

  return { serviceShuttered };
}
