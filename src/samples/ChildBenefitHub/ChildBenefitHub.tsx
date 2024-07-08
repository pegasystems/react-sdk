import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { loginIfNecessary, sdkIsLoggedIn } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import { useTranslation } from 'react-i18next';
import { registerServiceName } from '../../components/helpers/setPageTitleHelpers';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
import { triggerLogout } from '../../components/helpers/utils';
import { Link } from 'react-router-dom';

export default function ChildBenefitHub() {
  const history = useHistory();
  const { t } = useTranslation();
  const { hmrcURL } = useHMRCExternalLinks();

  registerServiceName(t('CHB_HOMEPAGE_HEADING'));
  const onRedirectDone = () => {
    history.push('/home');
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'embedded', mainRedirect: true });
  };

  useEffect(() => {
    if (!sdkIsLoggedIn()) {
      loginIfNecessary({ appName: 'embedded', mainRedirect: true, redirectDoneCB: onRedirectDone });
    }
  }, []);

  const handleSignout = () => {
    triggerLogout();
  };

  return sdkIsLoggedIn() ? (
    <>
      <AppHeader
        hasLanguageToggle
        betafeedbackurl={`${hmrcURL}contact/beta-feedback?service=463&referrerUrl=${window.location}`}
        appname={t('CHB_HOMEPAGE_HEADING')}
        handleSignout={handleSignout}
      />
      <div className='govuk-width-container'>
        <main className='govuk-main-wrapper govuk-main-wrapper--l' id='main-content' role='main'>
          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-two-thirds-from-desktop'>
              <h1 className='govuk-heading-xl'>{t('CHB_HOMEPAGE_HEADING')}</h1>
              <h2 className='govuk-heading-m'>{t('CHB_HOMEPAGE_MAKING_CLAIM_SUBHEADING')}</h2>
              <p>
                <a className='govuk-link' href='https://www.gov.uk/child-benefit'>
                  {t('CHB_HOMEPAGE_CHECK_IF_CAN_CLAIM_LINK')}
                </a>
              </p>
              <p>
                <a className='govuk-link' href='https://www.gov.uk/child-benefit/how-to-claim'>
                  {t('CHB_HOMEPAGE_MAKE_A_CLAIM_LINK')}
                </a>
              </p>
              <h2 className='govuk-heading-m'>{t('CHB_HOMEPAGE_MANAGE_CLAIM_SUBHEADING')}</h2>
              <p>
                <a className='govuk-link' href='https://www.gov.uk/report-changes-child-benefit'>
                  {t('CHB_HOMEPAGE_REPORT_CHANGES_LINK')}
                </a>
              </p>
              <p>
                <a className='govuk-link' href='https://www.gov.uk/child-benefit-16-19'>
                  {t('CHB_HOMEPAGE_CHILD_TURNS_16_GUIDANCE_LINK')}
                </a>
              </p>
              <p>
                <a
                  className='govuk-link'
                  href='https://www.tax.service.gov.uk/child-benefit/staying-in-education/extend-payments'
                >
                  {t('CHB_HOMEPAGE_EXTEND_PAYMENTS_LINK')}
                </a>
              </p>
              <p>
                <a
                  className='govuk-link'
                  href='https://www.tax.service.gov.uk/child-benefit/view-payment-history'
                >
                  {t('CHB_HOMEPAGE_VIEW_PAYMENT_HISTORY_LINK')}
                </a>
              </p>
              <p>
                <a
                  className='govuk-link'
                  href='https://www.tax.service.gov.uk/child-benefit/change-bank/change-account'
                >
                  {t('CHB_HOMEPAGE_CHANGE_BANK_DETAILS_LINK')}
                </a>
              </p>
              <p>
                <Link to='/view-proof-entitlement' className='govuk-link'>
                  {t('CHB_HOMEPAGE_VIEW_PROOF_OF_ENTITLEMENT_LINK')}
                </Link>
              </p>
              <p>
                <a className='govuk-link' href='https://www.gov.uk/child-benefit-tax-charge'>
                  {t('CHB_HOMEPAGE_HICBC_CHARGE_LINK')}
                </a>
              </p>
              <p className='govuk-body govuk-!-margin-bottom-9'></p>
            </div>
          </div>
          <a
            lang='en'
            className='govuk-link hmrc-report-technical-issue '
            href='https://www.tax.service.gov.uk/contact/report-technical-problem?newTab=true&service=PTA&referrerUrl=https%3A%2F%2Fwww.tax.service.gov.uk%2Fpersonal-account%2Fchild-benefit%2Fhome'
          >{`${t('PAGE_NOT_WORKING_PROPERLY')} ${t('OPENS_IN_NEW_TAB')}`}</a>
        </main>
      </div>

      <AppFooter />
    </>
  ) : (
    <></>
  );
}
