import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { loginIfNecessary, sdkIsLoggedIn } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from '../HighIncomeCase/reuseables/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import ReadOnlyDisplay from '../../components/BaseComponents/ReadOnlyDisplay/ReadOnlyDisplay';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import NoAwardPage from './NoAward';
import { registerServiceName } from '../../components/helpers/setPageTitleHelpers';
import { triggerLogout } from '../../components/helpers/utils';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
import { formatCurrency } from '../../components/helpers/utils';
import TimeoutPopup from '../../components/AppComponents/TimeoutPopup';
import { initTimeout } from '../../components/AppComponents/TimeoutPopup/timeOutUtils';

declare const PCore;
declare const myLoadMashup: any;

export default function ProofOfEntitlement() {
  const [entitlementData, setEntitlementData] = useState(null);
  const [showNoAward, setShowNoAward] = useState(false);
  const [showProblemWithService, setShowProblemWithService] = useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [b64PDFstring, setB64PDFstring] = useState(false);

  const { hmrcURL } = useHMRCExternalLinks(); 
  const history = useHistory();
  const {t} = useTranslation();

  registerServiceName(t('CHB_HOMEPAGE_HEADING'));

  const onRedirectDone = () => {
    history.replace('/view-proof-entitlement');
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
    document.addEventListener('SdkConstellationReady', () => {
      myLoadMashup('pega-root', false);
      PCore.onPCoreReady(() => {
        PCore.getDataPageUtils()
          .getPageDataAsync('D_GetChBEntitlement', 'root', {
            NINO: PCore.getEnvironmentInfo().getOperatorIdentifier()
          })
          .then(result => {
            // If no claimant data in response, assume no award (or api error)
            if (result.IsAPIError) {
              setShowProblemWithService(true);
            } else if (!result.HasAward) {
              setShowNoAward(true);
            } else {
              setEntitlementData(result);
            }
          })
          .catch(() => {
            setShowProblemWithService(true);
          });
      });

      PCore.getDataPageUtils()
        .getPageDataAsync('D_GetChBEntitlementContent', 'root', {
          NINO: PCore.getEnvironmentInfo().getOperatorIdentifier(),
          DocumentID: 'POE0001',
          Locale: PCore.getEnvironmentInfo().locale.replaceAll('-', '_')
        })
        .then(result => {
          setB64PDFstring(result.pyNote);
        });
    });
  }, []);

  return (
    <>
      <AppHeader
        appname={t('CHB_HOMEPAGE_HEADING')}
        hasLanguageToggle        
        betafeedbackurl={`${hmrcURL}contact/beta-feedback?service=463&referrerUrl=${window.location}`}
        handleSignout={sdkIsLoggedIn() ? triggerLogout : null}
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
      {sdkIsLoggedIn() && (
        <div className='govuk-width-container' id='poe-page'>
          <MainWrapper>
            {entitlementData && (
              <>
                <p className='print-only govuk-caption-xl govuk-!-margin-bottom-3'>
                  {entitlementData.Claimant?.pyFullName}
                </p>
                <h1 className='govuk-heading-l'>{t('PROOF_ENTITLEMENT_HEADING')}</h1>
                <p className='print-hidden govuk-body'>
                  <a href='#' className='govuk-link' onClick={window.print}>
                    {t('PRINT_THIS_PAGE')}
                  </a>
                  <br />
                  <a
                    className='govuk-link'
                    download='ProofOfEntitlement.pdf'
                    href={`data:application/pdf;base64,${b64PDFstring}`}
                  >
                    {t('DOWNLOAD_THIS_PAGE')}
                  </a>
                </p>
                <p className='govuk-body'>
                  {t('PROOF_ENTITLEMENT_CONFIRMATION')} {entitlementData.Claimant?.pyFullName}{' '}
                  {t('ON')} {dayjs().format('D MMMM YYYY')}.
                </p>
                <p className='govuk-body'>{t('POE_CHB_PAID_AT')}</p>
                <ul className='govuk-list govuk-list--bullet'>
                  <li>
                    {formatCurrency(entitlementData.HigherRateValue)} {t('POE_FOR_ELDEST_CHILD')}
                  </li>
                  <li>
                    {formatCurrency(entitlementData.StandardRateValue)}
                    {t('POE_FOR_ADDITIONAL_CHILD')}
                  </li>
                </ul>
                <h2 className='govuk-heading-m'>{t('PROOF_ENTITLEMENT_DETAILS_H2')}</h2>
                <p className='govuk-body print-hidden'>
                  {t('PROOF_ENTITLEMENT_IF_DETAILS_INCORRECT')}{' '}
                  <a
                    href='https://www.gov.uk/report-changes-child-benefit/if-your-familys-circumstances-change'
                    className='govuk-link'
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    {t('PROOF_ENTITLEMENT_IF_DETAILS_INCORRECT_CHANGE_YOUR_CIRCUSMSTANCES_LINK')}{' '}
                    {t('OPENS_IN_NEW_TAB')}
                  </a>{' '}
                  {t('PROOF_ENTITLMENT_IF_DETAILS_INCORRECT_OR_ABOUT')}{' '}
                  <a
                    href='https://www.gov.uk/report-changes-child-benefit'
                    className='govuk-link'
                    target='_blank'
                    rel='noreferrer noopener'
                  >
                    {t('PROOF_ENTITLEMENT_IF_DETAILS_INCORRECT_CHANGE_CHILDS_CIRCUMSTANCES_LINK')}{' '}
                    {t('OPENS_IN_NEW_TAB')}
                  </a>
                  {t('PROOF_ENTITLMENT_IF_DETAILS_INCORRECT_WILL_UPDATE')}
                </p>

                <dl className='govuk-summary-list page-break-after'>
                  <ReadOnlyDisplay
                    key='name'
                    label={t('POE_LABEL_NAME')}
                    value={entitlementData.Claimant?.pyFullName}
                  />
                  <ReadOnlyDisplay
                    key='address'
                    label={t('POE_LABEL_ADDRESS')}
                    value={entitlementData.Claimant?.CurrentAddress?.AddressCSV}
                    name={
                      entitlementData.Claimant?.CurrentAddress?.AddressCSV.indexOf(',') ? 'CSV' : ''
                    }                           
   
                  />
                  <ReadOnlyDisplay
                    key='amount'
                    label={t('POE_LABEL_AMOUNT')}
                    value={`${formatCurrency(entitlementData.AwardValue)} ${t('PER_WEEK')}`}
                  />
                  <ReadOnlyDisplay
                    key='startdate'
                    label={t('POE_LABEL_START_DATE')}
                    value={`${entitlementData.IsMigrated ? `${t('ON_OR_BEFORE')} ` : ''}${dayjs(
                      entitlementData.AwardStart
                    ).format('D MMMM YYYY')}`}
                  />
                  <ReadOnlyDisplay
                    key='enddate'
                    label={t('POE_LABEL_END_DATE')}
                    value={dayjs(entitlementData.AwardEnd).format('D MMMM YYYY')}
                  />
                </dl>

                {entitlementData.Children?.map(childData => {
                  return (
                    <React.Fragment key={childData?.pyFullName}>
                      <h2 className='govuk-heading-m'>
                        {t('CHILD_BENEFIT_DETAILS_FOR')} {childData?.pyFullName}
                      </h2>
                      <dl className='govuk-summary-list'>
                        <ReadOnlyDisplay
                          key={`${childData?.pyFullName} dob`}
                          label={t('POE_LABEL_CHILD_DOB')}
                          value={dayjs(childData.DateOfBirth).format('D MMMM YYYY') || ''}
                        />
                        <ReadOnlyDisplay
                          key={`${childData?.pyFullName} start`}
                          label={t('POE_LABEL_START_DATE')}
                          value={`${childData.IsMigrated ? `${t('ON_OR_BEFORE')} ` : ''}${dayjs(
                            childData.EligibilityStart
                          ).format('D MMMM YYYY')}`}
                        />
                        <ReadOnlyDisplay
                          key={`${childData?.pyFullName} end`}
                          label={t('POE_LABEL_END_DATE')}
                          value={dayjs(childData.EligibilityEnd).format('D MMMM YYYY')}
                        />
                      </dl>
                    </React.Fragment>
                  );
                })}

                <h2 className='govuk-heading-m print-hidden'>
                  {t('PROOF_ENTITLEMENT_VIEW_YOUR_PAYMENTS_H2')}
                </h2>
                <a
                  href='https://www.tax.service.gov.uk/child-benefit/view-payment-history'
                  className='govuk-link print-hidden'
                >
                  {t('PROOF_ENTITLEMENT_VIEW_PAST_PAYMENTS_LINK')}
                </a>
              </>
            )}
            {showNoAward && <NoAwardPage />}
            {showProblemWithService && (
              <>
                <h1 className='govuk-heading-l'>{t('SERVICE_NOT_AVAILABLE')}</h1>
                <p className='govuk-body'>{t('TRY_AGAIN_LATER')}</p>
                <p className='govuk-body'>{t('YOU_WILL_NEED_TO_START_AGAIN')}</p>
              </>
            )}
            <br />
            <br />
          </MainWrapper>
        </div>
      )}
      <AppFooter />
    </>
  );
}
