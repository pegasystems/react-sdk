import React from 'react';
import { useTranslation } from 'react-i18next';
import DateFormatter from '@pega/react-sdk-components/lib/components/helpers/formatters/Date';

export default function WarningText(props) {
  const { date } = props;
  const currentDate = DateFormatter.Date(date, { format: 'DD MMM YYYY' });
  const { t } = useTranslation();

  return (
    <div className='govuk-warning-text'>
      <span className='govuk-warning-text__icon' aria-hidden='true'>
        !
      </span>
      <strong className='govuk-warning-text__text'>
        <span className='govuk-visually-hidden'>Warning</span>
        {t('PORTAL_WARNING_TEXT')} {currentDate} {t('PORTAL_WARNING_TEXT2')}
      </strong>
    </div>
  );
}
