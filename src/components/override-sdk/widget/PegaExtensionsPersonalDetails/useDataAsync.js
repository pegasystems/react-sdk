import { useEffect, useState } from 'react';

const useGetDataAsync = ({ dataPageName }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    PCore.getDataPageUtils()
      .getDataAsync(dataPageName, '', {}, undefined, undefined, {
        invalidateCache: true
      })
      .then(response => {
        setData(response?.data[0]);
      })
      .catch(() => {
        setError('something went wrong please try again later');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dataPageName]);

  return {
    data,
    loading,
    error
  };
};
export default useGetDataAsync;
