import React from 'react';
import { t } from 'i18next';

export default function WarningText(props) {
  const { children } = props;

  return (
    <div className='govuk-warning-text'>
      <span className='govuk-warning-text__icon' aria-hidden='true'>
        !
      </span>
      <strong className='govuk-warning-text__text'>
        <span className='govuk-visually-hidden'> {t('GDS_INFO_WARNING')}</span>{" "}
        {children}
      </strong>
    </div>
  );
}
