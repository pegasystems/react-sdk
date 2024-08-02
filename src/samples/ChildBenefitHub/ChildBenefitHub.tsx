import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginIfNecessary, sdkIsLoggedIn } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from '../../samples/HighIncomeCase/reuseables/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import { useTranslation } from 'react-i18next';
import { registerServiceName } from '../../components/helpers/setPageTitleHelpers';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
import { triggerLogout } from '../../components/helpers/utils';

import MainWrapper from '../../components/BaseComponents/MainWrapper';
// import { Link } from 'react-router-dom';
import TimeoutPopup from '../../components/AppComponents/TimeoutPopup';
import { initTimeout } from '../../components/AppComponents/TimeoutPopup/timeOutUtils';


export default function ChildBenefitHub() {
  const history = useHistory();
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const { t } = useTranslation();
  const { referrerURL, hmrcURL } = useHMRCExternalLinks();

  registerServiceName(t('CHB_HOMEPAGE_HEADING'));
  const onRedirectDone = () => {
    history.replace('/home');
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'embedded', mainRedirect: true });
  };

  useEffect(() => {
    initTimeout(setShowTimeoutModal, false, true, false);
  }, []);

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
      <TimeoutPopup
        show={showTimeoutModal}
        staySignedinHandler={() => {
          setShowTimeoutModal(false);
          initTimeout(setShowTimeoutModal, false, true, false);
          // Using operator details call as 'app agnostic' session keep-alive
          PCore.getUserApi().getOperatorDetails(PCore.getEnvironmentInfo().getOperatorIdentifier());
        }}
        signoutHandler={triggerLogout}
        isAuthorised
        signoutButtonText='Sign out'
        staySignedInButtonText='Stay signed in'
      />
      <div className='govuk-width-container'>
        <MainWrapper>
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
                {/* TODO: Fix issue with ConstellationJS bootstrap on route change, 
                temporary fix provided for BUG-8996 (it is blocking US-14576-1)
                <Link to='/view-proof-entitlement' className='govuk-link'>
                  {t('CHB_HOMEPAGE_VIEW_PROOF_OF_ENTITLEMENT_LINK')}
                </Link> */}
                <a href={`${referrerURL}view-proof-entitlement`} className='govuk-link'>
                  {t('CHB_HOMEPAGE_VIEW_PROOF_OF_ENTITLEMENT_LINK')}
                </a>
              </p>
              <p>
                <a className='govuk-link' href='https://www.gov.uk/child-benefit-tax-charge'>
                  {t('CHB_HOMEPAGE_HICBC_CHARGE_LINK')}
                </a>
              </p>
              <p className='govuk-body govuk-!-margin-bottom-9'></p>
            </MainWrapper>       
      </div>

      <AppFooter />
    </>
  ) : (
    <></>
  );
}
