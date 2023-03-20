import React from 'react'

const ConfirmationPage = () => {
  // const getPConnect = props;
  // const pConn = getPConnect();
  // const caseId = pConn.getCaseInfo().getID();
  // const caseId = PCore.caseId

  return (
    <div className='govuk-width-container' id='content'>
      <main className='govuk-main-wrapper govuk-main-wrapper--l' id='main-content' role='main'>
        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-two-thirds'>
            <div className='govuk-panel govuk-panel--confirmation'>
              <h1 className='govuk-panel__title'>Application for Child Benefit completed</h1>
            </div>
            <h2 className='govuk-heading-m'>What happens next</h2>
            <p className='govuk-body'>We&apos;ve sent your application to child benefit service.</p>
            <p className='govuk-body'>
              We&apos;ll tell you in 14 calendar days if your application has been successful.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ConfirmationPage;
