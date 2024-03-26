import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CookiePageTable() {
  const { t } = useTranslation();
  const SEVEN_DAYS = t('SEVEN_DAYS');

  return (
    <table className='govuk-table'>
      <thead className='govuk-table__head'>
        <tr className='govuk-table__row'>
          <th scope='col' className='govuk-table__header'>
            {t('COOKIE_NAME')}
          </th>
          <th scope='col' className='govuk-table__header'>
            {t('COOKIE_PURPOSE')}
          </th>
          <th scope='col' className='govuk-table__header'>
            {t('COOKIE_EXPIRES')}
          </th>
        </tr>
      </thead>
      <tbody className='govuk-table__body'>
        <tr className='govuk-table__row'>
          <td className='govuk-table__cell'>AWSALB</td>
          <td className='govuk-table__cell'>{t('COOKIE_AWSALB_DESCRIPTION')}</td>
          <td className='govuk-table__cell'>{SEVEN_DAYS}</td>
        </tr>
        <tr className='govuk-table__row'>
          <td className='govuk-table__cell'>AWSALBCORS</td>
          <td className='govuk-table__cell'>{t('COOKIE_AWSALBCORS_DESCRIPTION')}</td>
          <td className='govuk-table__cell'>{SEVEN_DAYS}</td>
        </tr>
        <tr className='govuk-table__row'>
          <td className='govuk-table__cell'>JSESSIONID</td>
          <td className='govuk-table__cell'>{t('COOKIE_JSESSIONID_DESCRIPTION')}</td>
          <td className='govuk-table__cell'>{t('SESSION')}</td>
        </tr>
        <tr className='govuk-table__row'>
          <td className='govuk-table__cell'>PEGAODXEI</td>
          <td className='govuk-table__cell'>{t('COOKIE_PEGAODXEI_DESCRIPTION')}</td>
          <td className='govuk-table__cell'>{t('TEN_YEARS')}</td>
        </tr>
        <tr className='govuk-table__row'>
          <td className='govuk-table__cell'>PEGAODXDI</td>
          <td className='govuk-table__cell'>{t('COOKIE_PEGAODXDI_DESCRIPTION')}</td>
          <td className='govuk-table__cell'>{t('TEN_YEARS')}</td>
        </tr>
        <tr className='govuk-table__row'>
          <td className='govuk-table__cell'>AKA_A2</td>
          <td className='govuk-table__cell'>{t('COOKIE_AKA_A2_DESCRIPTION')}</td>
          <td className='govuk-table__cell'>{t('ONE_HOUR')}</td>
        </tr>
      </tbody>
    </table>
  );
}
