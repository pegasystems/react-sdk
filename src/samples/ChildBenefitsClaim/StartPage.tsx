import React from 'react';
import Button from '../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';

const StartPage: React.FC<{ onStart: React.MouseEventHandler; onBack: any }> = ({
  onStart,
  onBack
}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className='govuk-grid-column-two-thirds'>
        <Button
          variant='backlink'
          onClick={onBack}
          key='StartPageBacklink'
          attributes={{ type: 'link' }}
        />
      </div>
      <div className='govuk-grid-column-two-thirds'>
        <h1 className='govuk-heading-xl'>{t('CLAIM_CHILD_BENEFIT')}</h1>
        <p className='govuk-body'>
          {t('USE_THIS_FORM_TO_CLAIM')}
          <a
            className='govuk-link '
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.gov.uk/child-benefit-16-19'
          >
            {t('USE_THIS_FORM_TO_CLAIM_CONTD')}
          </a>
          .
        </p>
        <h2 className='govuk-heading-m'>{t('WHO_CAN_APPLY')}</h2>
        <p className='govuk-body'>{t('ONLY_ONE_PERSON_CAN')}</p>
        <p className='govuk-body'>{t('IF_YOU_ARE_IN_COUPLE')}</p>
        <p className='govuk-body'>{t('YOU_DONT_NEED_TO_BE_PARENT')}</p>
        <h2 className='govuk-heading-m'>{t('WHEN_TO_APPLY')}</h2>
        <p className='govuk-body'>{t('CLAIM_AS_SOON_AS_BABY_IS_BORN')}</p>
        <p className='govuk-body'>{t('CHILD_MUST_BE_UNDER_16')}</p>
        <h2 className='govuk-heading-m'> {t('BEFORE_YOU_START')}</h2>
        <p className='govuk-body'>{t('TO_COMPLETE_THIS_FORM_YOU_NEED')}</p>
        <ul className='govuk-list govuk-list--bullet'>
          <li> {t('BIRTH_CERTIFICATE')}</li>
          <li>{t('PASSPORT_OR_TRAVEL_DOCUMENT')}</li>
          <li>{t('ADOPTION_CERTIFICATE')}</li>
        </ul>
        <p className='govuk-body'>{t('YOU_WILL_ALSO_NEED')}</p>
        <ul className='govuk-list govuk-list--bullet'>
          <li>{t('YOUR_BANK_OR_BUILDING_DETAILS')}</li>
          <li>{t('YOUR_NINUMBER')}</li>
          <li>{t('PARTNERS_NINUMBER')}</li>
        </ul>
        <div className='govuk-warning-text'>
          <span className='govuk-warning-text__icon' aria-hidden='true'>
            !
          </span>
          <strong className='govuk-warning-text__text'>
            <span className='govuk-warning-text__assistive'>{t('WARNING')}</span>
            {t('DO_NOT_DELAY_MAKING')}
          </strong>
        </div>
        <Button variant='start' onClick={onStart}>
          {t('START_NOW')}
        </Button>
        <p className='govuk-body'>
          {t('IF_YOU_HAVE_ANY_QUESTIONS_REG_CHB')}
          <a
            href='https://www.gov.uk/government/organisations/hm-revenue-customs/contact/child-benefit'
            className='govuk-link'
          >
            {t('CONTACT_THE_CHILD_BENEFIT_HELPLINE')}
          </a>
        </p>
        <div className='govuk-!-margin-top-8'>
          <a
            lang='en'
            className='govuk-link hmrc-report-technical-issue '
            rel='noreferrer noopener'
            target='_blank'
            href='https://www.tax.service.gov.uk/contact/report-technical-problem?newTab=true&amp;service=claim-child-benefit&amp;referrerUrl=https%3A%2F%2Fwww.tax.service.gov.uk%2Ffill-online%2Fclaim-child-benefit%2F'
          >
            {t('PAGE_NOT_WORKING_PROPERLY')}
          </a>
        </div>
      </div>
    </>
  );
};

export default StartPage;
