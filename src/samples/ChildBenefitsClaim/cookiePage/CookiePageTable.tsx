import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CookiePageTable() {
  const { t } = useTranslation();
  const SEVEN_DAYS = t('SEVEN_DAYS');

  return (
    <table className="govuk-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            {t('COOKIE_NAME')}
          </th>
          <th scope="col" className="govuk-table__header">
            {t('COOKIE_PURPOSE')}
          </th>
          <th scope="col" className="govuk-table__header">
            {t('COOKIE_EXPIRES')}
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        <tr className="govuk-table__row">
          <td className="govuk-table__cell">
            AWSALB
          </td>
          <td className="govuk-table__cell">
            {t('COOKIE_AWSALB_DESCRIPTION')}
          </td>
          <td className="govuk-table__cell">
            {SEVEN_DAYS}
          </td>
        </tr>
        <tr className="govuk-table__row">
          <td className="govuk-table__cell">
            AWSALBCORS
          </td>
          <td className="govuk-table__cell">
            {t('COOKIE_AWSALBCORS_DESCRIPTION')}
          </td>
          <td className="govuk-table__cell">
            {SEVEN_DAYS}
          </td>
        </tr>
        <tr className="govuk-table__row">
          <td className="govuk-table__cell">
            JSESSIONID
          </td>
          <td className="govuk-table__cell">
            {t('COOKIE_JSESSIONID_DESCRIPTION')}
          </td>
          <td className="govuk-table__cell">
            {t('SESSION')}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
