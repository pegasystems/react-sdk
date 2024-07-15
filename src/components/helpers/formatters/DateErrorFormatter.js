import i18n from 'i18next';
import { isMultipleDateInput, getWorkareaContainerName } from './../utils';

const _DateErrorFormatter = (message, propertyName) => {
  // Function to check if the user has entered hyphens into the input
  const hasMoreThanThreeHyphens = msg => msg.split('-').length > 3;
  const dateRegExp = /(\d*-\d*-\d*)/;
  const matchedDates = message.match(dateRegExp);
  const originalDate = matchedDates?.length > 0 ? matchedDates[0] : null;
  const targets = [];
  const isDateOfBirth = propertyName?.toLowerCase().includes('date of birth');
  let invalidDateErrorMsgByField = '';

  if (originalDate && !hasMoreThanThreeHyphens(message)) {
    const [year, month, day] = originalDate.split('-');

    // When some 'parts' are missing
    let missingPartMessage = '';
    if (day === '') {
      missingPartMessage += '_A_DAY';
      targets.push('day');
    }
    if (month === '') {
      if (missingPartMessage.length > 0) missingPartMessage += '_AND_A_MONTH';
      else missingPartMessage += '_A_MONTH';
      targets.push('month');
    }
    if (year === '') {
      if (missingPartMessage.length > 0) missingPartMessage += '_AND_A_YEAR';
      else missingPartMessage += '_A_YEAR';
      targets.push('year');
    }
    let missingPartErrorMessage = i18n.t(`DATE_MUST_INCLUDE${missingPartMessage}`);
    if(isMultipleDateInput()) {
      const containerName = getWorkareaContainerName();
      const formEditablefields = PCore?.getFormUtils()?.getEditableFields(containerName);
      const formFields = formEditablefields?.filter(field => field.label === propertyName);
      let langLabelKey = formFields[0]?.fieldC11nEnv?.getMetadata()?.config?.label?.split('@L ').pop();
      langLabelKey = langLabelKey?.replace(' ', '_')?.toUpperCase();
      missingPartErrorMessage = i18n.t(`${langLabelKey}_MUST_INCLUDE${missingPartMessage}`);
      invalidDateErrorMsgByField = i18n.t(`${langLabelKey}_MUST_BE_A_REAL_DATE`);
    }

    if (missingPartMessage.length > 0) {
        return {
          message: missingPartErrorMessage,
          targets
        };
    }

    if (message.search(i18n.t('IS_NOT_A_VALID_DATE'))) {
      const invalidDateErrorMsg = invalidDateErrorMsgByField || i18n.t(`DATE_MUST_BE_A_REAL_DATE`);
      return {
        message: isDateOfBirth
          ? `${i18n.t('DATE_OF_BIRTH')} ${i18n.t('MUST_BE_A_REAL_DATE')}`
          : invalidDateErrorMsg,
        targets
      };
    }
  } else if (hasMoreThanThreeHyphens(message)) {
    return {
      message: isDateOfBirth
        ? `${i18n.t('DATE_OF_BIRTH')} ${i18n.t('MUST_BE_A_REAL_DATE')}`
        : i18n.t('DATE_MUST_BE_A_REAL_DATE'),
      targets
    };
  }
  return { message, targets };
};

export const DateErrorFormatter = (message, propertyName) => {
  if (propertyName === ' ') propertyName = i18n.t('DATE_OF_BIRTH');
  return _DateErrorFormatter(message, propertyName).message;
};

export const DateErrorTargetFields = message => {
  return _DateErrorFormatter(message).targets;
};
