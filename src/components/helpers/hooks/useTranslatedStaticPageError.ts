import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function useTranslatedStaticPageError(translationKey, lang, errorMsg) {
  const { t } = useTranslation();
  const [translatedError, setTranslatedError] = useState('');

  useEffect(() => {
    if (errorMsg.length > 0) {
      setTranslatedError(t(translationKey));
    }
  }, [lang, errorMsg]);

  return translatedError;
}
