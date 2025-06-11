import { useMemo, useState } from 'react';
import { t } from 'i18next';
import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import toggleNotificationProcess from '../../components/helpers/toggleNotificationLanguage';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import createPConnectComponent from '@pega/react-sdk-components/lib/bridge/react_pconnect';
import StoreContext from '@pega/react-sdk-components/lib/bridge/Context/StoreContext';
import Button from '../../components/BaseComponents/Button/Button';

import './home.css';

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
            <div className='gem-c-heading govuk-!-margin-bottom-8'>
              <h1 className='gem-c-heading__text govuk-heading-xl'>Child Benefit</h1>
            </div>

            <nav
              data-module='ga4-link-tracker'
              aria-label='Pages in this guide'
              className='gem-c-contents-list govuk-!-margin-bottom-4'
              data-ga4-link-tracker-module-started='true'
            >
              <h2 className='gem-c-contents-list__title'>Contents</h2>
              <ol className='gem-c-contents-list__list'>
                <li className='gem-c-contents-list__list-item gem-c-contents-list__list-item--dashed'>
                  <span className='gem-c-contents-list__list-item-dash' aria-hidden='true' />
                  <a
                    className='gem-c-contents-list__link govuk-link gem-c-force-print-link-styles'
                    data-ga4-link='{"event_name":"navigation","section":"Contents","type":"contents list","index_total":7,"index_link":1}'
                    href='/child-benefit'
                  >
                    How it works
                  </a>
                </li>
                <li className='gem-c-contents-list__list-item gem-c-contents-list__list-item--dashed'>
                  <span className='gem-c-contents-list__list-item-dash' aria-hidden='true' />
                  <a
                    className='gem-c-contents-list__link govuk-link gem-c-force-print-link-styles'
                    data-ga4-link='{"event_name":"navigation","section":"Contents","type":"contents list","index_total":7,"index_link":2}'
                    href='/child-benefit/what-youll-get'
                  >
                    What you&apos;ll get
                  </a>
                </li>
                <li className='gem-c-contents-list__list-item gem-c-contents-list__list-item--dashed'>
                  <span className='gem-c-contents-list__list-item-dash' aria-hidden='true' />
                  <a
                    className='gem-c-contents-list__link govuk-link gem-c-force-print-link-styles'
                    data-ga4-link='{"event_name":"navigation","section":"Contents","type":"contents list","index_total":7,"index_link":3}'
                    href='/child-benefit/when-and-how-its-paid'
                  >
                    When and how it&apos;s paid
                  </a>
                </li>
                <li className='gem-c-contents-list__list-item gem-c-contents-list__list-item--dashed'>
                  <span className='gem-c-contents-list__list-item-dash' aria-hidden='true' />
                  <a
                    className='gem-c-contents-list__link govuk-link gem-c-force-print-link-styles'
                    data-ga4-link='{"event_name":"navigation","section":"Contents","type":"contents list","index_total":7,"index_link":4}'
                    href='/child-benefit/eligibility'
                  >
                    Who can get Child Benefit
                  </a>
                </li>
                <li
                  className='gem-c-contents-list__list-item gem-c-contents-list__list-item--dashed gem-c-contents-list__list-item--active'
                  aria-current='true'
                >
                  <span className='gem-c-contents-list__list-item-dash' aria-hidden='true' />
                  Make a claim
                </li>
                <li className='gem-c-contents-list__list-item gem-c-contents-list__list-item--dashed'>
                  <span className='gem-c-contents-list__list-item-dash' aria-hidden='true' />
                  <a
                    className='gem-c-contents-list__link govuk-link gem-c-force-print-link-styles'
                    data-ga4-link='{"event_name":"navigation","section":"Contents","type":"contents list","index_total":7,"index_link":6}'
                    href='/child-benefit/make-a-change-to-your-claim'
                  >
                    Make a change to your claim
                  </a>
                </li>
                <li className='gem-c-contents-list__list-item gem-c-contents-list__list-item--dashed'>
                  <span className='gem-c-contents-list__list-item-dash' aria-hidden='true' />
                  <a
                    className='gem-c-contents-list__link govuk-link gem-c-force-print-link-styles'
                    data-ga4-link='{"event_name":"navigation","section":"Contents","type":"contents list","index_total":7,"index_link":7}'
                    href='/child-benefit/get-help-with-your-claim'
                  >
                    Get help with your claim
                  </a>
                </li>
              </ol>
            </nav>

            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-full'>
                <h1 className='govuk-heading-l'>Make a claim</h1>
              </div>
            </div>

            <div className='govuk-grid-row'>
              <div className='govuk-grid-column-full govuk-prototype-kit-common-templates-mainstream-guide-body'>
                <p className='govuk-body'>
                  You can claim Child Benefit 48 hours after you&apos;ve registered the birth of your child, or once a child comes to live with you.
                </p>
                <p className='govuk-body'>Child Benefit can be backdated for up to 3 months from the date you make the claim.</p>
                <div role='note' aria-label='Information' className='application-notice info-notice'>
                  <p>
                    If you&apos;re making a new claim for a child over 16, <a href='/child-benefit/eligibility'>check they&apos;re eligible</a>.
                  </p>
                </div>

                {/* <hr className='govuk-section-break govuk-section-break--xl govuk-section-break--visible' aria-hidden /> */}

                <div>
                  <h1 className='govuk-heading-m'>Deciding who should claim</h1>
                  <p className='govuk-body'>
                    Only one person can get Child Benefit for a child, so you need to decide whether it&apos;s better for you or the other parent to
                    claim.
                  </p>

                  <p className='govuk-body'>
                    Whoever claims will get National Insurance credits towards their state pension. The credits can fill gaps in your record if
                    you&apos;re not working or do not earn enough to pay National Insurance contributions.
                  </p>
                  <p className='govuk-body'>
                    You and your partner can claim for different children. If you live together, only one of you can claim at the higher rate, for the
                    eldest child in the household. If you both claim at the higher rate, you may have to pay back some of the money.
                  </p>
                </div>

                <div>
                  <h1 className='govuk-heading-s'>If you&apos;re under 16</h1>
                  <p className='govuk-body'>
                    You can either claim yourself or someone responsible for you can claim on your behalf. You&apos;ll usually get more if you claim
                    yourself.
                  </p>
                </div>

                <div>
                  <h2 className='govuk-heading-m' id='subsection-title'>
                    Make a claim online
                  </h2>
                  <p className='govuk-body'>Use this service to make a claim for Child Benefit or to add another child to an existing claim.</p>
                  <Button attributes={{ className: 'govuk' }} onClick={beginClaim} variant='start'>
                    Start now
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
