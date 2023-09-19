import i18n from "i18next";

const _DateErrorFormatter = (message, propertyName) => {
  const dateRegExp = /(\d*-\d*-\d*)/;
  const matchedDates = message.match(dateRegExp);
  const originalDate = matchedDates?.length > 0 ? matchedDates[0] : null;
  const targets = [];

  if(originalDate){
     const [year, month, day] = originalDate.split('-');

    // When some 'parts' are missing
    let missingPartMessage = ''
    if(day === ''){
      missingPartMessage += ` ${i18n.t('A_DAY')}`;
      targets.push('day');
    }
    if(month === ''){
      if(missingPartMessage.length > 0)  missingPartMessage += i18n.t('AND_A_MONTH');
      else missingPartMessage += i18n.t('A_MONTH');
      targets.push('month');
    }
    if (year === '') {
      if (missingPartMessage.length > 0) missingPartMessage += ` ${i18n.t('AND_A_YEAR')}`;
      else missingPartMessage += ` ${i18n.t('A_YEAR')}`;
      targets.push('year');
    }
    if (missingPartMessage.length > 0) {
      return { message: `${propertyName} ${i18n.t('MUST_INCLUDE')} ${missingPartMessage}`, targets };
    }

    if (message.search(i18n.t('IS_NOT_A_VALID_DATE'))) {
      return { message: `${propertyName} ${i18n.t('MUST_BE_A_REAL_DATE')} `, targets };
    }
  }
  return {message, targets};
}

export const DateErrorFormatter = (message, propertyName) => {
  if (propertyName === ' ') propertyName = i18n.t('DATE_OF_BIRTH');
  return _DateErrorFormatter(message, propertyName).message;
}

export const DateErrorTargetFields = (message) => {
  return _DateErrorFormatter(message, null).targets;
}
