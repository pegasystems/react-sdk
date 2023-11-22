import React, { useEffect } from 'react';
import Button from '../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';


const StartPage: React.FC<{ onStart: React.MouseEventHandler; onBack: any }> = ({
  onStart,
  onBack
}) => {
  const { t } = useTranslation();

  useEffect(()=>{
    setPageTitle();
  },[])

  return (
    <>
      <Button
        variant='backlink'
        onClick={onBack}
        key='StartPageBacklink'
        attributes={{ type: 'link' }}
      />
      <MainWrapper>
        <h1 className='govuk-heading-xl'>{t('BEGIN_NEW_CHB_CLAIM')}</h1>
        <p className='govuk-body'>
          {t('USE_THIS_FORM_TO_CLAIM')}
          <a
            className='govuk-link '
            target='_blank'
            rel='noopener noreferrer'
            href='https://www.gov.uk/child-benefit-16-19'
          >
            {t('USE_THIS_FORM_TO_CLAIM_CONTD')} {t('OPENS_IN_NEW_TAB')}
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
      </MainWrapper>
    </>
  );
};

export default StartPage;
