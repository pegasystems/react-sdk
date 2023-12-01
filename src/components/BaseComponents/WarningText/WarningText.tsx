import React from 'react';
import { useTranslation } from 'react-i18next';



export default function WarningText(props) {
   const {date} = props;
   const parts = date.split('/')
   const currentDate = new Date(parts[2], parts[1] - 1, parts[0]).toLocaleDateString('en-GB', {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
   const { t } = useTranslation();
 
  return (
<div className="govuk-warning-text">
  <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
  <strong className="govuk-warning-text__text">
    <span className="govuk-warning-text__assistive">Warning</span>
    { t('PORTAL_WARNING_TEXT')}  {currentDate}  {t('PORTAL_WARNING_TEXT2')}
  </strong>
</div>

  );
}

