import { useTranslation } from 'react-i18next';

const _DateErrorFormatter = (message, propertyName) => {
  const { t } = useTranslation();

  const dateRegExp = /(\d*-\d*-\d*)/;
  const matchedDates = message.match(dateRegExp);
  const originalDate = matchedDates?.length > 0 ? matchedDates[0] : null;
  const targets = []

  if(originalDate){
     const [year, month, day] = originalDate.split('-');

    // When some 'parts' are missing
    let missingPartMessage = ''
    if(day === ''){
      missingPartMessage += ` ${t('A_DAY')}`;
      targets.push('day');
    }
    if(month === ''){
      if(missingPartMessage.length > 0)  missingPartMessage += t('AND_A_MONTH');
      else missingPartMessage += t('A_MONTH');
      targets.push('month');
    }
    if (year === '') {
      if (missingPartMessage.length > 0) missingPartMessage += ` ${t('AND_A_YEAR')}`;
      else missingPartMessage += ` ${t('A_YEAR')}`;
      targets.push('year');
    }
    if (missingPartMessage.length > 0) {
      return { message: `${propertyName} ${t('MUST_INCLUDE')} ${missingPartMessage}`, targets };
    }

    if (message.search(t('IS_NOT_A_VALID_DATE'))) {
      return { message: `${propertyName} ${t('MUST_BE_A_REAL_DATE')} `, targets };
    }
  }
  return {message, targets};
}

export const DateErrorFormatter = (message, propertyName) => {
  return _DateErrorFormatter(message, propertyName).message;
}

export const DateErrorTargetFields = (message) => {
  return _DateErrorFormatter(message, null).targets;
}
