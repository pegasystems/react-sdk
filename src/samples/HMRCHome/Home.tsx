import { useMemo, useState } from 'react';
import { t } from 'i18next';
import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import toggleNotificationProcess from '../../components/helpers/toggleNotificationLanguage';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import Button from '../../components/BaseComponents/Button/Button';

function RootComponent(props) {
  const PegaConnectObj = createPConnectComponent();
  const thePConnObj = <PegaConnectObj {...props} />;

  /**
   * NOTE: For Embedded mode, we add in displayOnlyFA to our React context
   * so it is available to any component that may need it.
   * VRS: Attempted to remove displayOnlyFA but it presently handles various components which
   * SDK does not yet support, so all those need to be fixed up before it can be removed.
   * To be done in a future sprint.
   */
  const contextValue = useMemo(() => {
    return { store: PCore.getStore(), displayOnlyFA: true };
  }, [PCore.getStore()]);

  return <StoreContext.Provider value={contextValue}>{thePConnObj}</StoreContext.Provider>;
}

export default function Home({ rootProps }) {
  const [assignmentPConn, setAssignmentPConn] = useState(null);
  const [showPega, setShowPega] = useState(false);

  // eslint-disable-next-line no-console
  console.log(t('CLAIM_CHILD_BENEFIT'), rootProps);

  async function beginClaim() {
    const sLevel = 'Basic';
    setShowPega(true);

    // Get the SDK configuration
    const sdkConfig = await getSdkConfig();
    let mashupCaseType = sdkConfig.serverConfig.appMashupCaseType;

    // If mashupCaseType is null or undefined, get the first case type from the environment info
    if (!mashupCaseType) {
      // @ts-ignore - Object is possibly 'null'
      const caseTypes: any = PCore.getEnvironmentInfo().environmentInfoObject.pyCaseTypeList;
      mashupCaseType = caseTypes[0].pyWorkTypeImplementationClassName;
    }

    // Create options object with default values
    const options: any = {
      pageName: 'pyEmbedAssignment',
      startingFields: {}
    };

    // If mashupCaseType is 'DIXL-MediaCo-Work-NewService', add Package field to startingFields
    if (mashupCaseType === 'DIXL-MediaCo-Work-NewService') {
      options.startingFields.Package = sLevel;
    }

    // Create a new case using the mashup API
    PCore.getMashupApi()
      .createCase(mashupCaseType, PCore.getConstants().APP.APP, options)
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('createCase rendering is complete');
      });
  }

  const handleSignout = () => {
    setAssignmentPConn(null);
  };

  return (
    <div>
      <AppHeader
        handleSignout={handleSignout}
        appname={t('CLAIM_CHILD_BENEFIT')}
        hasLanguageToggle
        isPegaApp
        languageToggleCallback={toggleNotificationProcess({ en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' }, assignmentPConn)}
      />
      <div className='govuk-width-container'>
        {showPega ? (
          <RootComponent {...rootProps} />
        ) : (
          <main className='govuk-main-wrapper' id='main-content' role='main'>
            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-full'>
                <h1 className='govuk-heading-l'>Change your bank details with HMRC</h1>
              </div>
            </div>

            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body'>
                <p className='govuk-body'>Use this service to update the bank account HMRC uses to make payments to you.</p>
                <p className='govuk-body'>You can use this service if:</p>
                <ul className='govuk-list govuk-list--bullet'>
                  <li>
                    <span className='govuk-body'>Your new account is a UK bank account that accepts direct credits.</span>
                  </li>
                  <li>
                    <span className='govuk-body'>You are the account holder of the new bank account.</span>
                  </li>
                  <li>
                    <span className='govuk-body'>You have your National Insurance Number (NINO) ready.</span>
                  </li>
                </ul>

                <p className='govuk-body'>You cannot use this service if:</p>
                <ul className='govuk-list govuk-list--bullet'>
                  <li>
                    <span className='govuk-body'>You want to change a business account.</span>
                  </li>
                  <li>
                    <span className='govuk-body'>You receive payments to a joint account where you are not the main contact.</span>
                  </li>
                  <li>
                    <span className='govuk-body'>Your new account does not accept HMRC payments.</span>
                  </li>
                </ul>

                {/* <hr className='govuk-section-break govuk-section-break--xl govuk-section-break--visible' aria-hidden /> */}

                <div>
                  <h1 className='govuk-heading-m'>What you’ll need</h1>
                  <p className='govuk-body'>Before you start, make sure you have:</p>

                  <ul className='govuk-list govuk-list--bullet' style={{ listStyle: 'none' }}>
                    <li>
                      <span className='govuk-body'>Your current bank details (sort code and account number)</span>
                    </li>
                    <li>
                      <span className='govuk-body'>Your new bank details</span>
                    </li>

                    <li>
                      <span className='govuk-body'>Your National Insurance Number (NINO)</span>
                    </li>

                    <li>
                      <span className='govuk-body'>
                        It usually takes 7 working days for the change to take effect. You will receive a confirmation when your request is processed.
                      </span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className='govuk-heading-m' id='subsection-title'>
                    Start now
                  </h2>

                  <Button attributes={{ className: 'govuk' }} onClick={beginClaim} variant='start'>
                    Change your bank details
                  </Button>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>

      <AppFooter />
    </div>
  );
}
