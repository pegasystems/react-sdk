import React from 'react';
import { useTranslation } from 'react-i18next';

const ConfirmationPage = () => {
  // const getPConnect = props;
  // const pConn = getPConnect();
  // const caseId = pConn.getCaseInfo().getID();
  // const caseId = PCore.caseId

  const { t } = useTranslation();

  return (
    <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
      <div className="govuk-grid-row">
        <div className='govuk-grid-column-two-thirds'>
          <div className='govuk-panel govuk-panel--confirmation'>
            <h1 className='govuk-panel__title'> {t("APPLICATION_FOR_CHB_COMPLETE")}</h1>
          </div>
          <h2 className='govuk-heading-m'> {t("WHAT_HAPPENS_NEXT")}</h2>
          <p className='govuk-body'> {t("WE_HAVE_SENT_YOUR_APPLICATION")}</p>
          <p className='govuk-body'>
          {t("WE_WILL_TELL_YOU_IN_14_DAYS")}
          </p>
        </div>
      </div>
    </main>
  );
};

export default ConfirmationPage;
